// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList.js");

// 업체단건조회
const findCustCodeNo = async (customerNo) => {
  let list = await mariadb
    .query("shipmodel", [`${customerNo}`])
    .catch((err) => console.log(err));
  // let info = list[0]; //배열을 깨야됨. 그러고 객체로 만듬
  // return info;
  return list;
  // let info = [];

  // for (const row of list) {
  //   // row는 { cust_name: ..., MODEL_CODE: ..., REVISION: ... } 형태
  //   let obj = {
  //     cust_name: row.cust_name,
  //     model_code: row.MODEL_CODE,
  //     revision: row.REVISION,
  //   };
  //   info.push(obj);
  // }

  // return info;
};

module.exports = {
  findCustCodeNo,
};
