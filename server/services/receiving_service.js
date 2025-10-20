// mapper.js 불러오기
const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList.js");


// LOT 스캔 시 정보 조회
const findLotInfo = async (lotNo) => {
    
  let lotList = await mariadb
    .query("selectLotInfo", [lotNo])
    .catch((err) => console.log(err));
  console.log(lotList);
  return lotList;
};

module.exports = {
    findLotInfo,
};