// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

const {
  convertObjToAry,
  formatDate,
  formatFullDate,
} = require("../utils/converts.js");

// 작업지시 전체 조회
const findWorkOrd = async (workOrdNo = "") => {
  let list = await mariadb
    .query("selectWorkOrd", [`%${workOrdNo}%`])
    .catch((err) => console.log(err));
  return list;
};

// 작업지시에 따른 Bom 조회
const findBom = async (modelCode, revision) => {
  let list = await mariadb
    .query("selectBom", [`%${modelCode}%`, `%${revision}%`])
    .catch((err) => console.log(err));
  return list;
};

// Lot 전체 조회
const findLot = async (lotNo = "") => {
  let list = await mariadb
    .query("selectLot", [`%${lotNo}%`, `%${lotNo}%`])
    .catch((err) => console.log(err));
  return list;
};

// 시작버튼 생산실적 등록
const addProdResult = async (resultInfo) => {
  const { workOrdNo, modelCode, revision, proc_code, workQty, workStartTime } =
    resultInfo;
  // resultInfo : 사용자가 전달한 실적정보, Object 타입
  // console.log("resultInfo : ", resultInfo);

  let insertColumns = [
    workOrdNo,
    modelCode,
    revision,
    proc_code,
    workStartTime,
  ];
  console.log("🧩 insertColumns:", insertColumns);

  const resInfo = await mariadb
    .query("insertProdResult", insertColumns)
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

// 일시정지버튼 종료시간 업데이트
const updatePause = async (resultInfo) => {
  const { workEndTime, workOrdNo } = resultInfo;
  // resultInfo : 사용자가 전달한 실적정보, Object 타입
  // console.log("resultInfo : ", resultInfo);

  let insertColumns = [workEndTime, workOrdNo];
  console.log("🧩 insertColumns:", insertColumns);

  const resInfo = await mariadb
    .query("updatePause", insertColumns)
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

// 정지버튼 종료시간 업데이트
const updateEnd = async (resultInfo) => {
  const { workQty, workEndTime, workOrdNo } = resultInfo;
  // resultInfo : 사용자가 전달한 실적정보, Object 타입
  // console.log("resultInfo : ", resultInfo);

  let insertColumns = [workQty, workEndTime, workOrdNo];
  console.log("🧩 insertColumns:", insertColumns);

  const resInfo = await mariadb
    .query("updateEnd", insertColumns)
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
// 작업지시 등록
module.exports = {
  findWorkOrd,
  findBom,
  findLot,
  addProdResult,
  updatePause,
};
