const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require("../utils/converts.js");

// 전체 조회
const findAll = async (
  regPlanDate = "",
  startPlanDate = "",
  endPlanDate = "",
  modelCode = "",
  revision = "",
  procCode = ""
) => {
  try {
    let list = await mariadb.query("searchProdPlan", [
      regPlanDate ? `%${regPlanDate}%` : "%",
      startPlanDate ? `%${startPlanDate}%` : "%",
      endPlanDate ? `%${endPlanDate}%` : "%",
      modelCode ? `%${modelCode}%` : "%",
      revision ? `%${revision}%` : "%",
      procCode ? `%${procCode}%` : "%",
    ]);
    return list || [];
  } catch (err) {
    console.error("생산계획 조회 중 오류 발생:", err);
    return [];
  }
};

// 공정
const findProc = async () => {
  let list = await mariadb.query("selectProc").catch((err) => console.log(err));
  return list;
};

// 제품 등록, 수정
const addNewModel = async (modelInfo) => {
  // bookInfo : 사용자가 전달한 북정보, Object 타입

  // tb_model_master 테이블에 등록하는 insert문에 정의된 컬럼들
  let insertColumns = [
    "model_code",
    "revision",
    "model_name",
    "model_flag",
    "lot_p_qty",
    "model_class",
    "spec",
    "wid",
    "hei",
  ];
  // 사용자가 전달한 제품정보 중 insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
  let data = convertObjToAry(modelInfo, insertColumns);
  // modelInfo 는 model_router에서 옴

  let resInfo = await mariadb
    .query("insertModel", data)
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
  findProc,
  addNewModel,
};
