const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리

const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴

const commonService = require("../services/common_service.js");
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data)

// 실제 라우팅 등록 영역

//전체조회
router.get("/commonCode", async (req, res) => {
  let codeGroup = req.query.codeGroup;

  let commonList = await commonService
    .findAll(codeGroup)
    .catch((err) => console.log(err));

  res.send(commonList);
});

// 그룹조회
router.get("/commonCode/common", async (req, res) => {
  let commonList = await commonService
    .findCommon()
    .catch((err) => console.log(err));
  res.send(commonList);
});

// 등록
router.post("/commonCode/insert", async (req, res) => {
  let selectCommonInfo = req.body;
  let result = await commonService
    .addNewCommon(selectCommonInfo)
    .catch((err) => console.log(err));
  res.send(result);
});

module.exports = router;
