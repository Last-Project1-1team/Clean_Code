const express = require("express");
const router = express.Router();
const receivingService = require("../services/receiving_service");

router.get("/receiving", async (req, res) => {
  const lotNo = req.query.lotNo;

  try {
    const lotInfo = await receivingService.findLotInfo(lotNo);
    res.send(lotInfo);
  } catch (err) {
    console.error("❌ Lot 조회 오류:", err);
    res.status(500).send({ error: "Lot 조회 중 오류 발생" });
  }
});

// Lot 상태값 업데이트
router.post("/receiving/update", async (req, res) => {
  const updateLotInfo = Array.isArray(req.body) ? req.body : [req.body];
  try {
    const results = [];
    for (const updateLot of updateLotInfo) {
      const result = await receivingService.updateLot(updateLot);
      results.push(result);
    }
    res.send({ isSuccessed: true, results });
  } catch (err) {
    console.error("등록 실패:", err);
    res.status(500).send({ isSuccessed: false, message: err.message });
  }
});
module.exports = router;
