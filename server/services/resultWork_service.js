// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

const {
  convertObjToAry,
  formatDate,
  formatFullDate,
} = require("../utils/converts.js");

// 전체 조회
const findWorkOrd = async (workOrdNo) => {
  let list = await mariadb
    .query("selectWorkOrd", [`%${workOrdNo}%`])
    .catch((err) => console.log(err));
  return list;
};

// 작업지시 등록
const addWorkOrd = async (workInfo) => {
  const { modelCode, revision, workOrdQty, prodPlanNo } = workInfo;
  // workInfo : 사용자가 전달한 작업정보, Object 타입

  // console.log("workInfo : ", workInfo);

  let insertColumns = [workOrdNo, modelCode, revision, workOrdQty, prodPlanNo];
  console.log("🧩 insertColumns:", insertColumns);
  // let insertColumns = [workOrdNo, modelCode, revision, workOrdQty];
  // 사용자가 전달한 제품정보 중 insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
  // let data = convertObjToAry(workInfo, insertColumns);
  // workInfo 는 model_router에서 옴

  const resInfo = await mariadb
    .query("insertWorkOrder", insertColumns)
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
  findWorkOrd,
  addWorkOrd,
};
