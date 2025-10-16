// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

const { convertObjToAry } = require("../utils/converts.js");
// 실제 제공할 서비스 등록 영역
//
const findAll = async (groupCode) => {
  let list = await mariadb
    .query("selectGroupInfo", [`%${groupCode}%`])
    .catch((err) => console.log(err));
  return list;
};

//조회(셀렉트박스)
const findGroup = async () => {
  let list = await mariadb
    .query("selectGroup")
    .catch((err) => console.log(err));
  return list;
};

// 그룹기반으로 등록
const addNewGroup = async (groupInfo) => {
  //inser문의 정의된 컬럼들
  let insertColumns = ["groupCode", "groupName", "groupExp"];
  // 사용자가 전달한 북정보 중 insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
  let data = convertObjToAry(groupInfo, insertColumns);
  let resInfo = await mariadb
    .query("insertGroup", data)
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
  addNewGroup,
  findGroup,
};
