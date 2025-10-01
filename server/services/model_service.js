// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

//const { convertObjToAry } = require("../utils/converts.js");

// 실제 제공할 서비스 등록 영역
// 전체 조회
const findAll = async (modelCode, revision, modelName) => {
  let list = await mariadb
    .query("selectAllModelList", [
      `%${modelCode}%`,
      `%${revision}%`,
      `%${modelName}%`,
    ])
    .catch((err) => console.log(err));
  return list;
};
const findFlag = async () => {
  let list = await mariadb
    .query("selectModelFlag")
    .catch((err) => console.log(err));
  return list;
};

module.exports = {
  // 해당 객체에 등록해야지 외부로 노출
  findAll,
  findFlag,
};
