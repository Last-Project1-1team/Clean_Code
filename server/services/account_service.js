// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

const { convertObjToAry } = require("../utils/converts.js");
// 실제 제공할 서비스 등록 영역
// 조건 없이 전체조회
const findAll = async (userId, name, department, workGrade) => {
  // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
  // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
  let list = await mariadb
    .query("selectAccountInfo", [
      `%${userId || ""}%`,
      `%${name || ""}%`,
      `%${department || ""}%`,
      `%${workGrade || ""}%`,
    ])
    .catch((err) => console.log(err));
  return list;
};

// 직급 목록 조회
const findWorkGrade = async () => {
  let list = await mariadb
    .query("selectWorkGrade")
    .catch((err) => console.log(err));
  return list;
};

// 부서 목록 조회
const findDepartment = async () => {
  let list = await mariadb
    .query("selectDepartment")
    .catch((err) => console.log(err));
  return list;
};
// // 북번호를 기준으로 단건조회
// const findByBookNo = async (bookNo) => {
//     // bookNo : 사용자가 전달한 북번호, Number 타입
//     let list = await mariadb.query("selectBookOne", bookNo).catch((err) => console.log(err));
//     // mariadb 모듈의 경우 SELECT문의 결과는 갯수와 상관없이 배열로 반환
//     // -> 서비스의 결과로 값이 하나일 경우 변환이 필요함.
//     let info = list[0];
//     return info;
// };

// 북정보(name, writer, publisher, publication_date, info)를 기반으로 등록
const addNewItem = async (accountInfo) => {
  // bookInfo : 사용자가 전달한 북정보, Object 타입

  // t_book_01 테이블에 등록하는 insert문에 정의된 컬럼들
  let insertColumns = [
    "user_id",
    "password",
    "name",
    "work_grade",
    "department",
    "phone",
    "email",
    "hire_date",
    "retire_yn",
    "retire_date",
  ];
  // 사용자가 전달한 북정보 중 insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
  let data = convertObjToAry(itemInfo, insertColumns);
  let resInfo = await mariadb
    .query("inord", data)
    .catch((err) => console.log(err));
  // mariadb 모듈은 DML(insert, update, delete)의 결과를 { affectedRows: 1, insertId: 1, warningStatus: 0 } 로 반환
  // affectedRows : 실제 실행된 행수 (default : 0)
  // insertId     : AUTO_INCREMENT를 사용하는 경우 자동 부여된 PRIMARY KEY를 가짐, 무조건 Number 타입 (default : 0)
  console.log(resInfo.insertId);
  let result = null;
  if (resInfo.insertId == 0) {
    // 정상적으로 등록된 경우
    result = {
      isSuccessed: true,
      // itemCode: resInfo.insertId,
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
  findAll,
};
