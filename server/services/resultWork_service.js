// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList.js");

function formatDateTime(date) {
  if (!date) return null;
  const d = new Date(date);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

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
const findBom = async (modelCode, revision, workOrdNo) => {
  let list = await mariadb
    .query("selectBom", [`%${modelCode}%`, `%${revision}%`, `%${workOrdNo}%`])
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

// 공정완료 종료시간 업데이트
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

// 일시정지버튼 종료시간 insert
const pauseInsert = async (resultInfo) => {
  const { workOrdNo, modelCode, revision, proc_code, status, workEndTime } =
    resultInfo;
  // resultInfo : 사용자가 전달한 실적정보, Object 타입
  // console.log("resultInfo : ", resultInfo);

  let insertColumns = [
    workOrdNo,
    modelCode,
    revision,
    proc_code,
    "PAUSE",
    workEndTime,
  ];

  console.log("🧩 insertColumns:", insertColumns);

  const resInfo = await mariadb
    .query("pauseInsert", insertColumns)
    .catch((err) => console.log(err));

  console.log(resInfo.insertId);
  let result = null;
  if (resInfo.insertId > 0) {
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
  // resultInfo : 사용자가 전달한 실적정보, Object 타입
  const {
    proc_code,
    workQty,
    status,
    workEndTime,
    workOrdNo,
    modelCode,
    revision,
    workStartTime,
    usedLots,
  } = resultInfo;

  const formattedStartTime = formatDateTime(workStartTime);
  const formattedEndTime = formatDateTime(workEndTime);

  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    console.log("🚀 전체 작업 종료 트랜잭션 시작");
    console.log("📦 전달된 데이터:", resultInfo);

    let insertResultWork = [
      proc_code,
      workQty,
      status,
      formattedEndTime,
      workOrdNo,
    ];

    await conn.query(sqlList.updateEnd, insertResultWork);
    console.log("✅ tb_prod_result 업데이트 완료");

    let insertWorkOrder = [
      workQty,
      formattedStartTime,
      formattedEndTime,
      workOrdNo,
      modelCode,
      revision,
    ];
    await conn.query(sqlList.updateEndWorkOrd, insertWorkOrder);
    console.log("✅ tb_work_ord 업데이트 완료");
    // 마지막 공정 조회
    const [lastProc] = await conn.query(sqlList.selectLastProc, [modelCode]);
    const lastProcCode = lastProc?.proc_code || null;

    // 1. 오늘 날짜 YYMMDD 구하기
    const datePart = formatDate(new Date());

    // 2. 최근 LOT 번호 조회
    const lastList = await conn.query(sqlList.selectLastProdLotNo, [
      `${modelCode}${datePart}%`,
    ]);

    let seq = 1;

    if (lastList.length > 0) {
      const lastNo = lastList[0].prod_lot_no;

      // model_code로 시작하는 경우만 시퀀스 추출
      if (lastNo && lastNo.startsWith(modelCode)) {
        const lastSeq = parseInt(lastNo.slice(-5));
        if (!isNaN(lastSeq)) seq = lastSeq + 1;
      }
    }
    console.log("seq :" + seq);
    // 3. 신규 LOT 번호 생성 (model_code + 날짜 + 5자리 시퀀스)
    const prodLotNo = `${modelCode}${datePart}${String(seq).padStart(5, "0")}`;

    let insertProdLot = [
      prodLotNo,
      modelCode,
      revision,
      workOrdNo,
      workQty,
      lastProcCode,
      "Y",
      5,
      formattedEndTime,
    ];
    await conn.query(sqlList.insertEndProdLot, insertProdLot);
    console.log("✅ 생산LOT 업데이트 완료");

    // lot 상태 업데이트
    // 7️⃣ 사용된 LOT use_yn = 'N' 처리
    if (usedLots && usedLots.length > 0) {
      const placeholders = usedLots.map(() => "?").join(", ");
      const updateLotYnQuery = `
        UPDATE tb_lot
           SET use_yn = 'N'
         WHERE lot_no IN (${placeholders})
      `;
      await conn.query(updateLotYnQuery, usedLots);
      console.log("✅ 사용된 LOT 상태(use_yn) 변경 완료");
    } else {
      console.log("⚠️ 선택된 LOT 번호가 없어 use_yn 변경은 건너뜀");
    }

    await conn.commit();
    return { isSuccessed: true };
  } catch (error) {
    console.error("💥 전체 작업 종료 중 오류 발생:", error);
    if (conn) await conn.rollback();
    return { isSuccessed: false, error };
  } finally {
    if (conn) conn.release();
  }
};

// 작업지시 등록
module.exports = {
  findWorkOrd,
  findBom,
  findLot,
  addProdResult,
  pauseInsert,
  updatePause,
  updateEnd,
};
