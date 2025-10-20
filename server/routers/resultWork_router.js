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
    const workOrdNo = req.query.workOrdNo || "";

    console.log("📡 BOM 조회 요청:", modelCode, revision, workOrdNo);
    const lotList = await resultWorkService.findBom(
      modelCode,
      revision,
      workOrdNo
    );

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
router.post("/resultwork/save", async (req, res) => {
  // METHOD 중 POST와 PUT은 Http Request의 Body 영역을 가지며 req(Http Request에 대응되는 변수)의 body 속성에 등록됨
  // const resultInfoList = req.body;
  const resultInfoList = Array.isArray(req.body) ? req.body : [req.body];
  console.log("resultInfoList : ", resultInfoList);
  try {
    const results = [];
    for (const resultInfo of resultInfoList) {
      const result = await resultWorkService.addProdResult(resultInfo);
      results.push(result);
    }

    res.send({ isSuccessed: true, results });
  } catch (err) {
    console.error("💥 등록 실패:", err);
    res.status(500).send({ isSuccessed: false, message: err.message });
  }
});

// 일시정지 버튼 UPDATE
router.post("/resultwork/updatepause", async (req, res) => {
  // METHOD 중 POST와 PUT은 Http Request의 Body 영역을 가지며 req(Http Request에 대응되는 변수)의 body 속성에 등록됨
  // const resultInfoList = req.body;
  const resultInfoList = Array.isArray(req.body) ? req.body : [req.body];
  console.log("resultInfoList : ", resultInfoList);
  try {
    const results = [];
    for (const resultInfo of resultInfoList) {
      const result = await resultWorkService.updatePause(resultInfo);
      results.push(result);
    }

    res.send({ isSuccessed: true, results });
  } catch (err) {
    console.error("💥 등록 실패:", err);
    res.status(500).send({ isSuccessed: false, message: err.message });
  }
});

// 공정완료 버튼 UPDATE
router.post("/resultwork/updateproc", async (req, res) => {
  // METHOD 중 POST와 PUT은 Http Request의 Body 영역을 가지며 req(Http Request에 대응되는 변수)의 body 속성에 등록됨
  // const resultInfoList = req.body;
  const resultInfoList = Array.isArray(req.body) ? req.body : [req.body];
  console.log("resultInfoList : ", resultInfoList);
  try {
    const results = [];
    for (const resultInfo of resultInfoList) {
      const result = await resultWorkService.updateProc(resultInfo);
      results.push(result);
    }

    res.send({ isSuccessed: true, results });
  } catch (err) {
    console.error("💥 등록 실패:", err);
    res.status(500).send({ isSuccessed: false, message: err.message });
  }
});

// 종료버튼 실적UPDATE 생산LOT부여
router.post("/resultwork/finishAndInsertLot", async (req, res) => {
  // Vue.js에서 단일 payload 객체를 보낸다고 가정 (배열이 아니라)
  const payload = req.body;

  console.log("프로시저 호출 payload : ", payload); // Vue.js에서 보낸 데이터 확인

  try {
    // resultWorkService의 새로운 함수를 호출
    const result = await resultWorkService.finishAndInsertLot(payload);

    // 프로시저는 보통 값을 리턴하지 않거나 성공/실패 여부만 리턴
    // 만약 프로시저가 `SELECT` 문을 포함하면 `rows` 형태로 결과가 올 수 있음
    res.send({ isSuccessed: true, result });
  } catch (err) {
    console.error("💥 작업 종료 및 LOT 등록 실패:", err);
    res.status(500).send({ isSuccessed: false, message: err.message });
  }
});

// 정지 버튼 UPDATE 나중에 쓸수도 있어서 놔둠=== 프로시저로 변경했음
router.post("/resultwork/updateEnd", async (req, res) => {
  // METHOD 중 POST와 PUT은 Http Request의 Body 영역을 가지며 req(Http Request에 대응되는 변수)의 body 속성에 등록됨
  // const resultInfoList = req.body;
  const resultInfoList = Array.isArray(req.body) ? req.body : [req.body];
  console.log("resultInfoList : ", resultInfoList);
  try {
    const results = [];
    for (const resultInfo of resultInfoList) {
      const result = await resultWorkService.updateEnd(resultInfo);
      results.push(result);
    }

    res.send({ isSuccessed: true, results });
  } catch (err) {
    console.error("💥 등록 실패:", err);
    res.status(500).send({ isSuccessed: false, message: err.message });
  }
});
module.exports = router;
