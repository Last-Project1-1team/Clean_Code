// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

const { convertObjToAry } = require("../utils/converts.js");

// 실제 제공할 서비스 등록 영역
// 전체 조회
const findAll = async (modelCode, revision, modelName) => {
  let list = await mariadb
    .query("selectAllModelList", [
      `%${modelCode}%`,
      `%${revision}%`,
      `%${modelName}%`,
    ])
    .catch((err) => console.log(err));
  return list;
};
const findFlag = async () => {
  let list = await mariadb
    .query("selectModelFlag")
    .catch((err) => console.log(err));
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
  findFlag,
};
