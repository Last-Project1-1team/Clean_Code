// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");

//const { convertObjToAry } = require("../utils/converts.js");

// 생산계획번호로 작업지시 조회
const findPlan = async (prodPlanNo) => {
  let list = await mariadb
    .query("selectWorkOrder", [`%${prodPlanNo}%`])
    .catch((err) => console.log(err));
  return list;
};

// 작업지시 등록
