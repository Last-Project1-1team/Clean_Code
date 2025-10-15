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

// 등록    : 자원(데이터) -> books / 등록 -> POST
router.post("/commonCode/insert", async (req, res) => {
  // METHOD 중 POST와 PUT은 Http Request의 Body 영역을 가지며 req(Http Request에 대응되는 변수)의 body 속성에 등록됨
  let selectCommonInfo = req.body;
  console.log(selectCommonInfo);
  let result = await commonService
    .addNewCommon(selectCommonInfo)
    .catch((err) => console.log(err));
  res.send(result);
});

// 해당 javascript 파일의 마지막 코드, 모듈화
// 위에 선언한 기능(변수, 함수 등)들 중 외부로 노출할 대상을 설정
// => 다른 파일에서 require()을 통해 가져옴
module.exports = router;
