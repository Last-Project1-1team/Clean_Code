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

// 일시정지버튼 종료시간 업데이트
const updatePause = async (resultInfo) => {
  const { status, workEndTime, workOrdNo, proc_code } = resultInfo;
  // resultInfo : 사용자가 전달한 실적정보, Object 타입
  // console.log("resultInfo : ", resultInfo);

  let insertColumns = [status, workEndTime, workOrdNo, proc_code];
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

// 공정완료버튼 종료시간 업데이트
const updateProc = async (resultInfo) => {
  const { work_qty, status, workEndTime, workOrdNo, proc_code } = resultInfo;
  // resultInfo : 사용자가 전달한 실적정보, Object 타입
  // console.log("resultInfo : ", resultInfo);

  let insertColumns = [work_qty, status, workEndTime, workOrdNo, proc_code];
  console.log("🧩 insertColumns:", insertColumns);

  const resInfo = await mariadb
    .query("updateProc", insertColumns)
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

// 종료버튼 실적UPDATE 생산LOT INSERT
const finishAndInsertLot = async (payload) => {
  const {
    p_proc_code,
    p_work_qty,
    p_work_end_time,
    p_work_ord_no,
    p_model_code,
    p_revision,
    p_lot_qty,
    p_location,
  } = payload;

  try {
    // 1. 오늘 날짜 YYMMDD 구하기
    const datePart = formatDate(new Date());

    // 2. 최근 LOT 번호 조회
    const lastList = await mariadb.query("selectLastProdLotNo", []);

    let seq = 1;

    if (lastList && lastList.length > 0) {
      const lastNo = lastList[0].prod_lot_no;

      // model_code로 시작하는 경우만 시퀀스 추출
      if (lastNo && lastNo.startsWith(p_model_code)) {
        const lastSeq = parseInt(lastNo.slice(-5));
        if (!isNaN(lastSeq)) seq = lastSeq + 1;
      }
    }

    // 3. 신규 LOT 번호 생성 (model_code + 날짜 + 5자리 시퀀스)
    const prodLotNo = `${p_model_code}${datePart}${String(seq).padStart(
      5,
      "0"
    )}`;
    console.log("✨ 생성된 생산 LOT 번호:", prodLotNo);

    const procParams = [
      p_proc_code,
      p_work_qty,
      p_work_end_time,
      p_work_ord_no,
      prodLotNo,
      p_model_code,
      p_revision,
      p_lot_qty,
      p_location,
    ];

    console.log("⭐️ 프로시저 호출 파라미터:", procParams);

    const resInfo = await mariadb.query(
      "callFinishWorkAndInsertLot",
      procParams
    );
    console.log("✅ 프로시저 실행 결과:", resInfo);

    return {
      isSuccessed: true,
      prodLotNo: prodLotNo,
    };
  } catch (err) {
    console.error("❌ finishAndInsertLot 서비스 실행 중 오류:", err);
    throw new Error("프로시저 실행 실패: " + err.message);
  }
};
// const finishAndInsertLot = async (payload) => {
//   // 기존 payload에서 파라미터 추출 (p_prod_lot_no 제외)
//   const {
//     p_proc_code,
//     p_work_qty,
//     p_work_end_time,
//     p_work_ord_no,
//     p_model_code,
//     p_revision,
//     p_lot_qty,
//     p_location,
//   } = payload;

//   try {
//     // 1. 오늘 날짜 YYMMDD 구하기
//     const datePart = formatDate(new Date());

//     // 2. 해당 날짜로 시작하는 생산계획번호 최근 조회
//     const lastList = await mariadb.query("selectLastProdLotNo", []);

//     let seq = 1; // seq 변수는 항상 초기화

//     if (lastList && lastList.length > 0) {
//       const lastNo = lastList[0].prod_lot_no;
//       // PL로 시작하는 번호에서 날짜 다음 5자리가 시퀀스
//       if (lastNo && lastNo.startsWith("PL") && lastNo.length >= 13) {
//         const lastSeq = parseInt(lastNo.slice(-5));
//         if (!isNaN(lastSeq)) {
//           seq = lastSeq + 1;
//         }
//       }
//     }

//     // 3. 신규 생산계획번호 생성
//     const prodLotNo = `PL${datePart}${String(seq).padStart(5, "0")}`;
//     console.log("✨ 생성된 생산 LOT 번호:", prodLotNo);

//     // 프로시저에 전달할 파라미터 배열 (자동 생성한 prodLotNo 사용)
//     const procParams = [
//       p_proc_code,
//       p_work_qty,
//       p_work_end_time,
//       p_work_ord_no,
//       prodLotNo, // 자동 생성한 LOT 번호 사용
//       p_model_code,
//       p_revision,
//       p_lot_qty,
//       p_location,
//     ];

//     console.log("⭐️ 프로시저 호출 파라미터:", procParams);

//     // 프로시저 호출 (기존과 동일)
//     const resInfo = await mariadb.query(
//       "callFinishWorkAndInsertLot",
//       procParams
//     );

//     console.log("✅ 프로시저 실행 결과:", resInfo);

//     // 프론트엔드에 생성된 LOT 번호도 함께 반환
//     return {
//       isSuccessed: true,
//       prodLotNo: prodLotNo, // 생성된 LOT 번호도 함께 반환
//     };
//   } catch (err) {
//     console.error("❌ finishAndInsertLot 서비스 실행 중 오류:", err);
//     throw new Error("프로시저 실행 실패: " + err.message);
//   }
// };

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
  updateProc,
  updateEnd,
  finishAndInsertLot,
};
