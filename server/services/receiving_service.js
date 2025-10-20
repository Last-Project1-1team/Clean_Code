// mapper.js 불러오기
const mariadb = require("../database/mapper.js");
// const sqlList = require("../database/sqlList.js");

// LOT 스캔 시 정보 조회
const findLotInfo = async (lotNo) => {
  try {
    const lotList = await mariadb.query("selectLotInfo", [lotNo]);
    return lotList[0] || null; // 단건조회 첫 번째 행 반환
  } catch (err) {
    console.error("❌ DB 조회 오류:", err);
    return null;
  }
};

module.exports = {
  findLotInfo,
};
