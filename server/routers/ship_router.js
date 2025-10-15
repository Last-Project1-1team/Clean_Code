const express = require("express");
const router = express.Router();
const shipService = require("../services/ship_service.js");

//업체단건조회
router.get("/customerNo", async (req, res) => {
  let customerNo = req.query.inordCode;
  let customerInfo = await shipService
    .findCustCodeNo(customerNo)
    .catch((err) => console.log(err));
  res.send(customerInfo);
});

module.exports = router;
