const express = require("express");
const router = express.Router();
const receivingService = require("../services/receiving_service");

// LOT 스캔 요청
router.get("/lotNo", async (req, res) => {
  const { lotNo } = req.params;
  try {
    const rows = await conn.query(selectLotInfo, [lotNo]);

    if (rows.length === 0) {
      return res.json({ status: "NOT_FOUND", message: "LOT 정보가 존재하지 않습니다." });
    }

    res.json({ status: "OK", data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "ERROR", message: "서버 오류" });
  }
});

module.exports = router;
