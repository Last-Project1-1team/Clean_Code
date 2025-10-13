const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리

const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴

const workOrderService = require("../services/workOrder_service.js");
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data)

// 전체 조회
router.get("/workorder", async (req, res) => {
  let { prodPlanNo } = req.query;

  let planList = await workOrderService
    .findPlan(prodPlanNo)
    .catch((err) => console.log(err));

  res.send(planList);
});

// auto complete 부분
router.get("/workorder/autocomplete", async (req, res) => {
  let { keyword } = req.query;

  // console.log("🔍 받은 keyword:", keyword);

  let planList = await workOrderService
    .findPlanNo(keyword)
    .catch((err) => console.log(err));

  res.send(planList);
});

// 등록    : 자원(데이터) -> work / 등록 -> POST
router.post("/workorder", async (req, res) => {
  // METHOD 중 POST와 PUT은 Http Request의 Body 영역을 가지며 req(Http Request에 대응되는 변수)의 body 속성에 등록됨
  let workInfo = req.body;
  console.log(workInfo);
  let result = await workOrderService
    .addWorkOrd(workInfo)
    .catch((err) => console.log(err));
  res.send(result);
});

module.exports = router;
