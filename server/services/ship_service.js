// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList.js");

// 수주, lot 단건조회
const findCustCodeNo = async (custno) => {
  let inordlist = await mariadb
    .query("shipmodel", [custno])
    .catch((err) => console.log(err));
  console.log(inordlist);
  return inordlist;
};

const findLotNo = async (lotno) => {
  let lotlist = await mariadb
    .query("lotnoscan", [lotno])
    .catch((err) => console.log(err));
  console.log(lotlist);
  return lotlist;
};

//출하등록

module.exports = {
  findCustCodeNo,
  findLotNo,
};
