// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList.js");

// 수주단건조회
const findCustCodeNo = async (custno) => {
  let inordlist = await mariadb
    .query("shipmodel", [custno])
    .catch((err) => console.log(err));
  console.log(inordlist);
  return inordlist;
};
//lot단건조회
const findLotNo = async (lotno) => {
  let lotlist = await mariadb
    .query("lotnoscan", [lotno])
    .catch((err) => console.log(err));
  console.log(lotlist);
  return lotlist;
};

//제품단건조회
const findmodel = async (modelno) => {
  const inClause = modelno.map((no) => `'${no}'`).join(",");
  const modelsql = sqlList.modelinfoIn.replace("IN (?)", `IN (${inClause})`); //const query = mariadb.query('modelinfoIn', inClause); //이렇게 하면 ('B00001','B00002') => (''B00001','B00002'') 이렇게 되버림

  const modellist = await mariadb
    .query(modelsql, modelno)
    .catch((err) => console.log(err));
  return modellist;
};
//
//
//출하단건조회
const findship = async (custcode, shipdate) => {
  console.log("custcode: ", custcode);
  let shipDate = formatFullDate(shipdate);
  console.log("shipDate:", shipDate);
  let shiplist = await mariadb
    .query("selectShip", [`${custcode}%`, `${custcode}%`, shipDate, shipDate])
    .catch((err) => console.log(err));
  return shiplist;
};
//
//
// 발주등록
const {
  convertObjToAry,
  formatDate,
  formatFullDate,
} = require("../utils/converts.js");
// 북정보(name, writer, publisher, publication_date, info)를 기반으로 등록
const addNewShip = async (ships) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 오늘 날짜 YYMMDD 구하기
    const today = new Date();
    const datePart = formatDate(today);
    let shipDate = formatFullDate(today);
    console.log("datePart: ", datePart);
    const lastList = await conn.query(sqlList.selectLastShipNo, [
      `OI${datePart}%`,
    ]);

    let seq = 1;
    if (lastList.length > 0) {
      const lastNo = lastList[0].SHIP_NO;
      const lastSeq = parseInt(lastNo.slice(-5)); // 마지막 5자리 -를하면 뒤에서5번째자리부터 끝까지임
      seq = lastSeq + 1;
    }
    // let indelDate = formatFullDate(paprdDate);

    // 신규 출하번호 생성 (OO + YYMMDD + 5자리SEQ)
    const shipNo = `OI${datePart}${String(seq).padStart(5, "0")}`;
    const createdBy = "tester";
    console.log("shipNo: ", shipNo);

    // 마스터 등록
    let insertMaster = [
      shipNo,
      ships[0].custcode,
      shipDate,
      ships[0].inordno,
      createdBy,
    ];
    await conn.query(sqlList.insertshipmaster, insertMaster);

    // 상세 등록
    let detailNo = 1;
    // createdBy = "0000000000000000000000000000000000000000000000000000000000000000000000000000";
    for (const ship of ships) {
      let insertDetail = [
        detailNo,
        shipNo,
        ship.prodlotno,
        ship.modelcode,
        ship.revision,
        ship.lotpqty,
        createdBy,
      ];
      await conn.query(sqlList.insertshipdetail, insertDetail);
      detailNo++;
    }

    await conn.commit();
    return { shipNo, shipCount: ships.length };
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("수주 등록 실패:", error);
    throw error;
  } finally {
    if (conn) conn.release?.();
  }
};

//출하등록

module.exports = {
  findCustCodeNo,
  findLotNo,
  findmodel,
  addNewShip,
  findship,
};
