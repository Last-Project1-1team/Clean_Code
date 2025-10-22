// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

const { convertObjToAry } = require("../utils/converts.js");

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

const findUnit = async () => {
  let list = await mariadb.query("selectUnit").catch((err) => console.log(err));
  return list;
};

// 제품 등록, 수정
const addNewModel = async (modelInfo) => {
  let insertColumns = [
    "model_code",
    "revision",
    "model_name",
    "model_flag",
    "lot_p_qty",
    "spec",
    "wid",
    "hei",
    "unit",
  ];
  let data = convertObjToAry(modelInfo, insertColumns);
  const resInfo = await mariadb
    .query("insertModel", data)
    .catch((err) => console.log(err));

  console.log(resInfo.insertId);
  let result = null;
  if (resInfo.insertId == 0) {
    // 정상적으로 등록된 경우
    result = {
      isSuccessed: true,
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
  // 해당 객체에 등록해야지 외부로 노출
  findAll,
  findFlag,
  findUnit,
  addNewModel,
};
