const mariadb = require("../database/mapper.js");
const {
  convertObjToAry,
  formatDate,
  formatFullDate,
} = require("../utils/converts.js");

// 전체 조회
const findAll = async (
  startPlanDate = "",
  endPlanDate = "",
  modelCode = "",
  revision = "",
  procCode = ""
) => {
  try {
    // 🔹 기본 검색 기간
    let startDate = startPlanDate || "1900-01-01";
    let endDate = endPlanDate
      ? await addDaysToDate(endPlanDate, 1)
      : "9999-12-31";

    // 🔹 SQL 파라미터 순서 맞춰서 넣기
    const params = [
      startDate,
      endDate, // 1~2
      startDate,
      endDate, // 3~4
      startDate,
      endDate, // 5~6
      modelCode ? `%${modelCode}%` : "%", // 7
      revision ? `%${revision}%` : "%", // 8
      procCode ? `%${procCode}%` : "%", // 9
    ];

    const list = await mariadb.query("searchProdPlan", params);
    return list || [];
  } catch (err) {
    console.error("❌ 생산계획 조회 중 오류:", err);
    throw err;
  }
};

async function addDaysToDate(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 공정
const findProc = async () => {
  let list = await mariadb.query("selectProc").catch((err) => console.log(err));
  return list;
};

// 수주량 합계
const findInordQty = async (modelCode = "", revision = "") => {
  try {
    let quantities = await mariadb.query("sumQty", [
      modelCode ? `%${modelCode}%` : "%",
      revision ? `%${revision}%` : "%",
    ]);
    return quantities || [];
  } catch (err) {
    console.error("수주량 합계 조회 중 오류 발생:", err);
    return [];
  }
};

// 생산계획 등록
const insertProdPlan = async (planData) => {
  const {
    createDate,
    startDate,
    endDate,
    planQty,
    modelCode,
    revision,
    procCode,
  } = planData;

  // 1. 오늘 날짜 YYMMDD 구하기
  const datePart = formatDate(new Date());

  // 2. 해당 날짜로 시작하는 생산계획번호 최근 조회
  const lastList = await mariadb.query("selectLastProdPlanNo", [
    `PP${datePart}%`,
  ]);

  let seq = 1; // seq 변수는 항상 초기화

  if (lastList.length > 0) {
    const lastNo = lastList[0].prod_plan_no;
    const lastSeq = parseInt(lastNo.slice(-5));
    seq = lastSeq + 1;
  }

  // 3. 신규 생산계획번호 생성
  const prodPlanNo = `PP${datePart}${String(seq).padStart(5, "0")}`;

  // 4. 삽입할 데이터 배열 생성 (planData에서 가져온 값들을 바로 사용)
  const insertColumns = [
    prodPlanNo,
    createDate,
    startDate,
    endDate,
    planQty,
    modelCode,
    revision,
    procCode,
  ];
  const resInfo = await mariadb
    .query("insertProdPlan", insertColumns)
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
  findProc,
  findInordQty,
  insertProdPlan,
};
