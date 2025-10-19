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

  // 작업지시번호별로 데이터 그룹화
  const groupedData = {};

  if (list && list.length) {
    list.forEach((item) => {
      if (!groupedData[item.workOrdNo]) {
        // 첫 데이터로 기본 정보 설정
        groupedData[item.workOrdNo] = {
          workOrdNo: item.workOrdNo,
          modelCode: item.modelCode,
          revision: item.revision,
          modelName: item.modelName,
          workOrdQty: item.workOrdQty,
          proc: item.proc, // 작업지시에 지정된 원래 공정
          procCode: item.procCode,
          allProcs: [], // 모든 공정 정보를 저장할 배열
        };
      }

      // 모든 공정 정보 추가
      groupedData[item.workOrdNo].allProcs.push({
        procCode: item.procCode,
        proc: item.proc,
        procSeq: item.procSeq,
      });
    });
  }
  // 객체를 배열로 변환
  return Object.values(groupedData);
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
  const { workOrdNo, modelCode, revision, proc_code, status, workStartTime } =
    resultInfo;
  // resultInfo : 사용자가 전달한 실적정보, Object 타입
  // console.log("resultInfo : ", resultInfo);

  let insertColumns = [
    workOrdNo,
    modelCode,
    revision,
    proc_code,
    status,
    workStartTime,
  ];
  console.log("🧩 insertColumns:", insertColumns);

  const resInfo = await mariadb
    .query("insertProdResult", insertColumns)
    .catch((err) => console.log(err));

  console.log(resInfo.insertId);
  let result = null;
  if (resInfo.insertId > 0) {
    // 0보다 크면 성공!
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
  const { work_qty, status, workEndTime, workOrdNo, proc_code } = resultInfo;
  // resultInfo : 사용자가 전달한 실적정보, Object 타입
  // console.log("resultInfo : ", resultInfo);

  let insertColumns = [work_qty, status, workEndTime, workOrdNo, proc_code];
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
  const { proc_code, work_qty, status, workEndTime, workOrdNo } = resultInfo;
  // resultInfo : 사용자가 전달한 실적정보, Object 타입
  // console.log("resultInfo : ", resultInfo);

  let insertColumns = [proc_code, work_qty, status, workEndTime, workOrdNo];
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
  updateEnd,
};
