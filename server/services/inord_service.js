// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

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
//
// 수주MASTER등록
const { convertObjToAry } = require("../utils/converts.js");
const addNewinord = async (masterinfo, detailinfo) => {
  // 1) 수주번호 발급
  const [masterseqRow] = await conn.query(
    // [변수명]으로 변수를 선언함.이렇게 하면 호추할 때 첫행 결과값을 바로 꺼내 쓸 수 있음.
    "SELECT fn_next_inord_no() AS inord_no;" // 시퀀스문을 실행해서 결과값을 배열로 반환
  );
  const inordNo = masterseqRow.inord_no; //첫행 바로 호출
  let masterColumns = [
    "INORD_NO",
    "STATUS",
    "CUST_CODE",
    "TOTAL_QTY",
    "INORD_DATE",
    "PAPRD_DATE",
  ];
  // insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
  let masterdata = convertObjToAry(
    //masterInfo객체에 masterColumns의 각 칼럼들을 담아서 masterdata라는 배열로 바꾸는 거임
    { ...masterinfo, INORD_NO: inordNo }, // masterinfo?
    masterColumns
  );
  let resinfomaster = await mariadb
    .query("insertinordmaster", masterdata)
    .catch((mastererr) => console.log(mastererr));
  //
  //
  //
  // 같은 변수 안에서 수주DETAIL등록
  let detailColumns = [
    "INORD_DETAIL_NO",
    "INORD_NO",
    "STATUS",
    "CUST_CODE",
    "TOTAL_QTY",
    "INORD_DATE",
    "PAPRD_DATE",
  ];
  // insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
  const [detailSeqRow] = await mariadb.query(
    "SELECT fn_next_inord_detail_no() AS inord_detail_no;"
  );
  const inordDetailNo = detailSeqRow.inord_detail_no; //[detailSeqRow]을 하면 배열 안에 첫 행을 바로 꺼내서 쓸 수 있음.
  const row = convertObjToAry(
    { INORD_NO: inordNo, INORD_DETAIL_NO: inordDetailNo },
    detailColumns
  );
  const r = await conn.query("insertinorddetail", row);
  if (r.affectedRows !== 1) throw new Error("DETAIL insert failed");

  let result = null;
  if (resinfodetail.affectedRows > 0) {
    // 정상적으로 등록된 경우
    result = {
      isSuccessed: true,
      masterno: masterdata[0], //원래는 resinfo.insertId를 쓰는데 테이블에 자동증가 PK가 없어서 배열로 INORD_NO를 직접 넣음
      detailno: detaildata[0], //원래는 resinfo.insertId를 쓰는데 테이블에 자동증가 PK가 없어서 배열로 INORD_DETAIL_NO를 직접 넣음
    };
  } else {
    // 등록되지 않은 경우
    result = {
      isSuccessed: false,
    };
  }
  return result;
};

module.exports = {
  findinordAll,
  addNewinord,
};
