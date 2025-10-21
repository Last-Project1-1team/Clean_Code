const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리

const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴

const workOrderService = require("../services/workOrder_service.js");
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data)

// 공정
router.get("/workorder/proc", async (req, res) => {
  let procList = await workOrderService
    .findProc()
    .catch((err) => console.log(err));

  res.send(procList);
});

// 전체 조회
router.get("/workorder/search", async (req, res) => {
  let proc = req.query.proc;
  let prodPlanDate = req.query.prodPlanDate;

  let planList = await workOrderService
    .findPlan(proc, prodPlanDate)
    .catch((err) => console.log(err));

  res.send(planList);
});

// auto complete 부분
// router.get("/workorder/autocomplete", async (req, res) => {
//   let { keyword } = req.query;

//   // console.log("🔍 받은 keyword:", keyword);

//   let planList = await workOrderService
//     .findPlanNo(keyword)
//     .catch((err) => console.log(err));

//   res.send(planList);
// });

// 등록    : 자원(데이터) -> work / 등록 -> POST
router.post("/workorder/save", async (req, res) => {
  let workInfoList = req.body;
  console.log("workInfoList :", workInfoList);

  // workInfoList가 배열이 아닐 경우 배열로 감싸기
  if (!Array.isArray(workInfoList)) {
    workInfoList = [workInfoList];
  }

  try {
    const results = [];
    for (const workInfo of workInfoList) {
      const result = await workOrderService.addWorkOrd(workInfo);
      results.push(result);
    }

    res.send({ isSuccessed: true, results });
  } catch (err) {
    console.error("💥 등록 실패:", err);
    res.status(500).send({ isSuccessed: false, message: err.message });
  }
});
// router.post("/workorder/save", async (req, res) => {
//   // METHOD 중 POST와 PUT은 Http Request의 Body 영역을 가지며 req(Http Request에 대응되는 변수)의 body 속성에 등록됨
//   const workInfoList = req.body;
//   console.log("workInfoList : ", workInfoList);
//   try {
//     const results = [];
//     for (const workInfo of workInfoList) {
//       const result = await workOrderService.addWorkOrd(workInfo);
//       results.push(result);
//     }

//     res.send({ isSuccessed: true, results });
//   } catch (err) {
//     console.error("💥 등록 실패:", err);
//     res.status(500).send({ isSuccessed: false, message: err.message });
//   }
// });

module.exports = router;
