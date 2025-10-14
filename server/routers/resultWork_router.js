const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리

const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴

const resultWorkService = require("../services/resultWork_service.js");
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data)

// 전체 조회
router.get("/resultwork/search", async (req, res) => {
  let workOrdNo = req.query.workOrdNo;

  let workOrdtList = await workOrderService
    .findWorkOrd(workOrdNo)
    .catch((err) => console.log(err));

  res.send(workOrdtList);
});

// 등록    : 자원(데이터) -> work / 등록 -> POST
router.post("/workorder/save", async (req, res) => {
  // METHOD 중 POST와 PUT은 Http Request의 Body 영역을 가지며 req(Http Request에 대응되는 변수)의 body 속성에 등록됨
  const workInfoList = req.body;
  console.log("workInfoList : ", workInfoList);
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

module.exports = router;
