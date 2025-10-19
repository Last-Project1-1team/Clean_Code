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
      endPlanDate || "9999-12-31", // 계획 시작일 <= 종료일
      startPlanDate || "1900-01-01", // 계획 종료일 >= 시작일
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

const findInordQty = async (
  regPlanDate = "",
  startPlanDate = "",
  endPlanDate = "",
  modelCode = "",
  revision = "",
  procCode = ""
) => {
  try {
    let quantities = await mariadb.query("sumQty", [
      regPlanDate ? `%${regPlanDate}%` : "%",
      startPlanDate ? `%${startPlanDate}%` : "%",
      endPlanDate ? `%${endPlanDate}%` : "%",
      modelCode ? `%${modelCode}%` : "%",
      revision ? `%${revision}%` : "%",
      procCode ? `%${procCode}%` : "%",
    ]);
    return quantities || [];
  } catch (err) {
    console.error("수주량 합계 조회 중 오류 발생:", err);
    return [];
  }
};

// 생산계획 등록
const insertProdPlan = async (planData) => {
  try {
    const result = await mariadb.query("insertProdPlan", [
      planData.createDate,
      planData.startDate,
      planData.endDate,
      planData.planQty,
      planData.modelCode,
      planData.revision,
      planData.procCode,
    ]);
    return { success: true, data: result };
  } catch (err) {
    console.error("생산계획 등록 중 오류 발생:", err);
    return { success: false, error: err.message };
  }
};

module.exports = {
  // 해당 객체에 등록해야지 외부로 노출
  findAll,
  findProc,
  findInordQty,
  insertProdPlan,
};
