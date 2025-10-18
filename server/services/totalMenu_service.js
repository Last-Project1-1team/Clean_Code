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

//선택시 소메뉴조회
const findSubMenu = async (bMenuCode) => {
  let list = await mariadb
    .query("selectSmenu",[bMenuCode])
    .catch((err) => console.log(err));
  return list;
};

//모달창안 대메뉴등록
const addNewBMenu = async (info) => {
  const cols = ["bMenuCode", "bMenuName"];
  const data = convertObjToAry(info, cols);
  await mariadb.query("insertBmenu", data);
};

//모달창안 소메뉴등록
const addNewSMenu = async (info) => {
  const cols = ["bMenuCode", "sMenuCode", "sMenuName", "programName"];
  const data = convertObjToAry(info, cols);
  const resInfo = await mariadb.query("insertSmenu", data);
  return {
    isSuccessed: resInfo.affectedRows > 0,
  };
};

module.exports = {
  findAll,
  findSubMenu,
  addNewBMenu,
  addNewSMenu,
};
