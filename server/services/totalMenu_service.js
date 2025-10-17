// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

//서비스 등록 영역
const { convertObjToAry } = require("../utils/converts.js");

// 조건 없이 전체조회
const findAll = async () => {
  let list = await mariadb
    .query("selectBmenu")
    .catch((err) => console.log(err));
  return list;
};

// //조회(셀렉트박스)
// const findCommon = async () => {
//   let list = await mariadb
//     .query("selectCommon")
//     .catch((err) => console.log(err));
//   return list;
// };

//메뉴정보 기반으로 등록(menuInfo : 사용자가 전달한 메뉴정보, Object 타입)
const addNewMenu = async (totalInfo) => {
  // tb_auth_group_menu 테이블에 등록하는 insert문에 정의된 컬럼들 (변경해야함)
  let insertColumns1 = ["bMenuCode", "bMenuName", "programName"];
  let data = convertObjToAry(totalInfo, insertColumns1);
  let resInfo = await mariadb
    .query("insertBmenu", data)
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
  addNewMenu,
};
