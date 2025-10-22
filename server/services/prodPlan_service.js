const mariadb = require("../database/mapper.js");
const {
  convertObjToAry,
  formatDate,
  formatFullDate,
} = require("../utils/converts.js");

// 전체 조회
const findAll = async (
  regPlanDate = "",
  startPlanDate = "",
  endPlanDate = "",
  modelCode = "",
  revision = "",
  procCode = "",
  lastProcName = ""
) => {
  try {
    const params = [];
    params.push(regPlanDate ? `%${regPlanDate}%` : "%");

    let param2_endDateForUpper = "9999-12-31";
    let param3_startDateForLower = "1900-01-01";

    if (startPlanDate && endPlanDate) {
      param2_endDateForUpper = endPlanDate
        ? await addDaysToDate(endPlanDate, 1)
        : "9999-12-31";
      param3_startDateForLower = startPlanDate;
    } else if (startPlanDate) {
      param2_endDateForUpper = "9999-12-31";
      param3_startDateForLower = startPlanDate;
    } else if (endPlanDate) {
      param2_endDateForUpper = endPlanDate
        ? await addDaysToDate(endPlanDate, 1)
        : "9999-12-31";
      param3_startDateForLower = "1900-01-01";
    }

    params.push(param2_endDateForUpper);
    params.push(param3_startDateForLower);
    params.push(modelCode ? `%${modelCode}%` : "%");
    params.push(revision ? `%${revision}%` : "%");
    // params.push(procCode ? `%${procCode}%` : "%");

    // 1. 먼저 조건에 맞는 모든 계획 목록을 조회한다.
    let list = await mariadb.query("searchProdPlan", params);

    // 2. 조회된 목록이 없으면 그냥 빈 배열 반환
    if (!list || list.length === 0) {
      return [];
    }

    // 3. 가장 오래된 계획 종료일과 가장 최근 계획 시작일 찾기 (Node.js에서!)
    //    list의 각 item은 객체 형태로 startPlanDate와 endPlanDate를 가지고 있을 거야.
    //    이 값들은 이미 DATE_FORMAT으로 'YYYY-MM-DD' 문자열 형태로 변환되어있으니,
    //    비교를 위해 Date 객체로 다시 변환해야 정확해.

    let minEndDate = new Date("9999-12-31"); // 충분히 미래 날짜로 초기화
    let maxStartDate = new Date("1900-01-01"); // 충분히 과거 날짜로 초기화

    list.forEach((item) => {
      const itemStartDate = new Date(item.startPlanDate); // 조회된 날짜 문자열을 Date 객체로
      const itemEndDate = new Date(item.endPlanDate); // 조회된 날짜 문자열을 Date 객체로

      if (itemEndDate < minEndDate) {
        minEndDate = itemEndDate; // 가장 오래된 종료일 갱신
      }
      if (itemStartDate > maxStartDate) {
        maxStartDate = itemStartDate; // 가장 최근 시작일 갱신
      }
    });

    // 4. 조건 확인: 가장 오래된 계획 종료일이 가장 최근 계획 시작일보다 오래되었는지?
    //    "가장 오래된 계획 종료일" < "가장 최근 계획 시작일" 이면 안 보이게 한다.
    //    즉, minEndDate < maxStartDate 이면 이 조건에 부합하지 않는 것이므로 빈 배열 반환.
    if (minEndDate > maxStartDate) {
      console.log(
        `[Validation Failed] minEndDate (${minEndDate
          .toISOString()
          .slice(0, 10)}) < maxStartDate (${maxStartDate
          .toISOString()
          .slice(0, 10)})`
      );
      return []; // 조건을 만족하지 않으므로 빈 배열 반환
    }

    // 5. 모든 조건을 만족하면 원래 조회된 목록 반환
    return list;
  } catch (err) {
    console.error("생산계획 조회 중 오류 발생:", err);
    throw err;
  }
};

async function addDaysToDate(dateString, days) {
  // 기존 addDaysToDate 함수 유지
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 공정
// const findProc = async () => {
//   let list = await mariadb.query("selectProc").catch((err) => console.log(err));
//   return list;
// };

// 수주량 합계
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
  findAll,
  // findProc,
  findInordQty,
  insertProdPlan,
};
