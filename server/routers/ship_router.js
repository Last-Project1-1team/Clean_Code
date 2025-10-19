const express = require("express");
const router = express.Router();
const shipService = require("../services/ship_service.js");

//수주단건조회
router.get("/customerNo", async (req, res) => {
  let customerNo = req.query.inordCode;
  let customerInfo = await shipService
    .findCustCodeNo(customerNo)
    .catch((err) => console.log(err));
  res.send(customerInfo);
});
//
//LOT단건조회
router.get("/lotNo", async (req, res) => {
  let lotNo = req.query.LotNo;
  console.log("수주제품리비전라우터: ", lotNo);
  let LotInfo = await shipService
    .findLotNo(lotNo)
    .catch((err) => console.log(err));
  res.send(LotInfo);
});

//제품 단건조회 (최종)
router.get("/modelno", async (req, res) => {
  console.log("제품정보router:", req.query.modelNo);

  const ModelNos = Array.isArray(req.query.modelNo)
    ? req.query.modelNo
    : [req.query.modelNo]; // 단일값일 때도 배열로 맞춤
  const modelInfo = await shipService.findmodel(ModelNos).catch(console.log);
  res.send(modelInfo);
});

// 발주등록
router.post("/insertship", async (req, res) => {
  const { ships } = req.body;
  console.log("ships: ", ships);

  try {
    const result = await shipService.addNewShip(ships);
    res.status(200).json({
      message: "발주정보 저장 성공",
      shipNo: result.shipNo,
      shipCount: result.shipCount,
    });
  } catch (error) {
    console.error("❌ 수주 저장 실패:", error);
    res.status(500).json({
      message: "수주정보 저장 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

module.exports = router;
