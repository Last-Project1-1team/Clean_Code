// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

// 수주MASTER등록
const { convertObjToAry } = require("../utils/converts.js");
const addNewinordmaster = async (inordinfo) => {
  let insertColumns = [
    "INORD_NO",
    "STATUS",
    "CUST_CODE",
    "TOTAL_QTY",
    "INORD_DATE",
    "PAPRD_DATE",
  ];
  // insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
  let data = convertObjToAry(masterInfo, insertColumns);

  let resInfo = await mariadb
    .query("insertinordmaster", data)
    .catch((err) => console.log(err));
  // mariadb 모듈은 DML(insert, update, delete)의 결과를 { affectedRows: 1, insertId: 1, warningStatus: 0 } 로 반환
  // affectedRows : 실제 실행된 행수 (default : 0)
  // insertId     : AUTO_INCREMENT를 사용하는 경우 자동 부여된 PRIMARY KEY를 가짐, 무조건 Number 타입 (default : 0)

  let result = null;
  if (resInfo.insertId > 0) {
    // 정상적으로 등록된 경우
    result = {
      isSuccessed: true,
      bookNo: resInfo.insertId,
    };
  } else {
    // 등록되지 않은 경우
    result = {
      isSuccessed: false,
    };
  }
  return result;
};
//
//
//
// 수주DETAIL등록
const addNewinorddetail = async (inorddetailinfo) => {
  let insertColumns = ["", "", "", "", ""];
  let data = convertObjToAry(bookInfo, insertColumns);

  let resInfo = await mariadb
    .query("insertinorddetail", data)
    .catch((err) => console.log(err));

  let result = null;
  if (resInfo.insertId > 0) {
    // 정상적으로 등록된 경우
    result = {
      isSuccessed: true,
      bookNo: resInfo.insertId,
    };
  } else {
    // 등록되지 않은 경우
    result = {
      isSuccessed: false,
    };
  }
  return result;
};

// 수주상세삭제
// 북번호를 기준으로 북정보 삭제
const removeinorddetailInfo = async (inorddetailno) => {
  // bookNo : 사용자가 전달한 북번호, Number 타입
  let result = await mariadb
    .query("deleteinorddetail", inorddetailno)
    .catch((err) => console.log(err));
  return result;
};

// 수주삭제
// 북번호를 기준으로 북정보 삭제
const removeinordmasterInfo = async (deleteinorddetail) => {
  // bookNo : 사용자가 전달한 북번호, Number 타입
  let result = await mariadb
    .query("deleteinordmaster", deleteinorddetail)
    .catch((err) => console.log(err));
  return result;
};

module.exports = {
  addNewinordmaster,
  addNewinorddetail,
  removeinorddetailInfo,
  removeinordmasterInfo,
};
