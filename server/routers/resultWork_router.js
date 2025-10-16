const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리

const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴

const resultWorkService = require("../services/resultWork_service.js");
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data)

// 작업지시 전체조회 , 단건조회
router.get("/resultwork/search", async (req, res) => {
  try {
    const workOrdNo = req.query.workOrdNo || ""; // 없으면 전체조회
    const workOrdList = await resultWorkService.findWorkOrd(workOrdNo);

    res.send(workOrdList); // 항상 배열로 반환
  } catch (err) {
    console.error("작업지시 조회 실패:", err);
    res.status(500).send({ message: "서버 오류" });
  }
});

// 작업지시에 따른 Bom조회
router.get("/resultwork/bomlist", async (req, res) => {
  try {
    const modelCode = req.query.modelCode || "";
    const revision = req.query.revision || "";

    // console.log("📡 BOM 조회 요청:", modelCode, revision);
    const lotList = await resultWorkService.findBom(modelCode, revision);

    res.send(lotList); // 항상 배열로 반환
  } catch (err) {
    console.error("BOM 조회 실패:", err);
    res.status(500).send({ message: "서버 오류" });
  }
});

// Lot 전체조회 , 단건조회
router.get("/resultwork/lotlist", async (req, res) => {
  try {
    const lotNo = req.query.lotNo || ""; // 없으면 전체조회

    const lotList = await resultWorkService.findLot(lotNo);

    res.send(lotList); // 항상 배열로 반환
  } catch (err) {
    console.error("작업지시 조회 실패:", err);
    res.status(500).send({ message: "서버 오류" });
  }
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
