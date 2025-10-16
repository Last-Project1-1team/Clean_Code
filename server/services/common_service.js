// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

const { convertObjToAry } = require("../utils/converts.js");
// 실제 제공할 서비스 등록 영역
// 조건 없이 전체조회
const findAll = async (codeGroup) => {
  // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
  // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
  let list = await mariadb
    .query("selectCommonInfo", [`%${codeGroup}%`])
    .catch((err) => console.log(err));
  return list;
};

//조회(셀렉트박스)
const findCommon = async () => {
  let list = await mariadb
    .query("selectCommon")
    .catch((err) => console.log(err));
  return list;
};

// 북정보(name, writer, publisher, publication_date, info)를 기반으로 등록
const addNewCommon = async (commonInfo) => {
  // bookInfo : 사용자가 전달한 북정보, Object 타입

  // t_book_01 테이블에 등록하는 insert문에 정의된 컬럼들
  let insertColumns = ["commonCode", "groupCode", "codeName"];
  // 사용자가 전달한 북정보 중 insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
  let data = convertObjToAry(commonInfo, insertColumns);
  let resInfo = await mariadb
    .query("insertCommon", data)
    .catch((err) => console.log(err));
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
  addNewCommon,
  findCommon,
};
