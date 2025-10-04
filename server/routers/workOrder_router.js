const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리

const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴

const workOrderService = require("../services/workOrder_service.js");
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data)

router.get("/workorder", async (req, res) => {
  let prodPlanNo = req.query.prodPlan;

  let planList = await workOrderService
    .findPlan(prodPlanNo)
    .catch((err) => console.log(err));

  res.send(planList);
});

module.exports = router;
