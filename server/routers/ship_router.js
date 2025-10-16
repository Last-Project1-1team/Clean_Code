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
  let LotInfo = await shipService
    .findLotNo(lotNo)
    .catch((err) => console.log(err));
  res.send(LotInfo);
});

module.exports = router;
