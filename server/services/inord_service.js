// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList.js");

// 업체전체조회
const findinordAll = async () => {
  // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
  // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
  let list = await mariadb
    .query("selectInordList")
    .catch((err) => console.log(err));
  return list;
};
// modeule.exports에 추가
//
//
//수주단건조회
const findinord = async (custcode, inorddate) => {
  console.log("custcode: ", custcode);
  let inordDate = formatFullDate(inorddate);
  console.log("inordDate:", inordDate);
  let inordlist = await mariadb
    .query("selectInord", [
      `${custcode}%`,
      `${custcode}%`,
      inordDate,
      inordDate,
    ])
    .catch((err) => console.log(err));
  return inordlist;
};
// 수주등록
const {
  convertObjToAry,
  formatDate,
  formatFullDate,
} = require("../utils/converts.js");
// 북정보(name, writer, publisher, publication_date, info)를 기반으로 등록
const addNewInord = async (orderDate, paprdDate, custCode, models) => {
  let conn;
  try {
    //DB 커넥션을 가져옴.
    //여러 SQL을 한 번에 처리하기 위해 트랜잭션 시작 (beginTransaction()). 여러 작업을 한 트랜잭션으로
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 오늘 날짜 YYMMDD 구하기
    const datePart = formatDate(orderDate);
    const lastList = await conn.query(sqlList.selectLastInordNo, [
      `IO${datePart}%`,
    ]);
    let seq = 1;
    if (lastList.length > 0) {
      const lastNo = lastList[0].INORD_NO;
      const lastSeq = parseInt(lastNo.slice(-5)); // 마지막 5자리 -를하면 뒤에서5번째자리부터 끝까지임
      seq = lastSeq + 1;
    }
    let inordDate = formatFullDate(orderDate);
    let indelDate = formatFullDate(paprdDate);

    // 신규 수주번호 생성 (OO + YYMMDD + 5자리SEQ)
    const inordNo = `IO${datePart}${String(seq).padStart(5, "0")}`;
    const createdBy = "tester";

    // 마스터 등록
    let insertMaster = [inordNo, inordDate, custCode, indelDate, createdBy];
    await conn.query(sqlList.insertInordMaster, insertMaster);

    // 상세 등록
    let detailNo = 1;
    // createdBy = "0000000000000000000000000000000000000000000000000000000000000000000000000000";
    for (const model of models) {
      let insertDetail = [
        detailNo,
        inordNo,
        model.modelCode,
        model.inordQty,
        createdBy,
      ];
      await conn.query(sqlList.insertInordDetail, insertDetail);
      detailNo++;
    }

    await conn.commit();
    return { inordNo, modelCount: models.length };
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("수주 등록 실패:", error);
    throw error;
  } finally {
    if (conn) conn.release?.();
  }
};

module.exports = {
  findinordAll,
  findinord,
  addNewInord,
};
