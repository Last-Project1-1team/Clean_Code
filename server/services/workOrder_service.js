// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

const {
  convertObjToAry,
  formatDate,
  formatFullDate,
} = require("../utils/converts.js");

const findPlan = async (prodPlanNo) => {
  // 전체조회면 '%'만 사용
  const keyword =
    prodPlanNo && prodPlanNo.trim() !== "" ? `%${prodPlanNo}%` : "%";

  // console.log("🔍 받은 prodPlanNo:", prodPlanNo);
  // console.log("🔍 실제 검색 키워드:", keyword);

  const list = await mariadb
    .query("selectProdPlan", [keyword])
    .catch((err) => console.log(err));

  // console.log("🧾 조회 결과:", list);
  return list;
};

const findPlanNo = async (keyword) => {
  let list = await mariadb
    .query("selectProdPlanNo", [`%${keyword}%`])
    .catch((err) => console.log(err));
  // console.log("🧾 조회 결과:", list);
  return list;
};

// 작업지시 등록
const addWorkOrd = async (workInfo) => {
  // workInfo : 사용자가 전달한 작업정보, Object 타입

  console.log("workInfo : ", workInfo);

  // 작업지시번호 시퀀스
  // 오늘 날짜 YYMMDD 구하기
  const datePart = formatDate(new Date());
  const lastList = await mariadb.query("selectLastWorkOrdNo", [
    `WO${datePart}%`,
  ]);
  let seq = 1;

  if (lastList.length > 0) {
    const lastNo = lastList[0].WORK_ORD_NO;
    const lastSeq = parseInt(lastNo.slice(-5)); // 마지막 5자리 추출
    seq = lastSeq + 1;
  }
  // let workOrdDate = formatFullDate(workOrdDate);

  // 신규 작업지시번호 생성 (OO + YYMMDD + 5자리SEQ)
  const workOrdNo = `WO${datePart}${String(seq).padStart(5, "0")}`;

  workInfo.work_ord_no = workOrdNo;

  // tb_work_ord 테이블에 등록하는 insert문에 정의된 컬럼들
  //let insertColumns = ["work_ord_no", "model_code", "revision", "work_ord_qty"];
  let insertColumns = [workOrdNo, modelCode, revision, workOrdQty];
  // 사용자가 전달한 제품정보 중 insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
  let data = convertObjToAry(workInfo, insertColumns);
  // workInfo 는 model_router에서 옴

  let resInfo = await mariadb
    .query("insertWorkOrder", data)
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
// 작업지시 등록
module.exports = {
  findPlan,
  findPlanNo,
  addWorkOrd,
};
