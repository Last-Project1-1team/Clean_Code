const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리

const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴

const prodPlanService = require("../services/prodPlan_service.js");
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data)

// 실제 라우팅 등록 영역

router.get("/prodplan", async (req, res) => {
  // 쿼리 파라미터는 undefined일 수도 있으니 기본값을 ''로 주는 게 안전
  const regPlanDate = req.query.regPlanDate || "";
  const startPlanDate = req.query.startPlanDate || "";
  const endPlanDate = req.query.endPlanDate || "";
  const modelCode = req.query.modelCode || "";
  const revision = req.query.revision || "";
  const procCode = req.query.procCode || "";

  try {
    const prodList = await prodPlanService.findAll(
      regPlanDate,
      startPlanDate,
      endPlanDate,
      modelCode,
      revision,
      procCode
    );

    // 조회 성공 시 200 OK와 함께 데이터 전송
    res.json(prodList);
  } catch (err) {
    // 서비스 단에서 발생한 오류를 여기서 처리하고 클라이언트에게 응답
    console.error("생산계획 조회 라우터 오류 발생:", err);

    // 클라이언트에게 500 Internal Server Error 상태와 함께 오류 메시지 전송
    res.status(500).json({
      message: "생산계획 조회 중 서버 오류가 발생했습니다.",
      // 개발 단계에서는 상세 오류 메시지를 포함할 수 있지만,
      // 실제 배포 환경에서는 보안상 err.message는 제외하는 게 좋음
      // error: err.message
    });
  }
});

// 공정
router.get("/prodplan/proc", async (req, res) => {
  let procList = await prodPlanService
    .findProc()
    .catch((err) => console.log(err));

  res.send(procList);
});

// 수주량
router.get("/prodplan/inordqty", async (req, res) => {
  try {
    const {
      regPlanDate,
      startPlanDate,
      endPlanDate,
      modelCode,
      revision,
      procCode,
    } = req.query;

    const quantities = await prodPlanService.findInordQty(
      regPlanDate,
      startPlanDate,
      endPlanDate,
      modelCode,
      revision,
      procCode
    );

    res.json(quantities);
  } catch (error) {
    console.error("수주량 합계 조회 라우트 오류:", error);
    res.status(500).json({ error: "수주량 합계 조회 중 오류가 발생했습니다." });
  }
});

// 생산계획 등록
router.post("/prodplan/save", async (req, res) => {
  try {
    const planData = req.body;

    // 필수 필드 검증
    if (!planData.modelCode || !planData.revision || !planData.procCode) {
      return res.status(400).json({ error: "필수 정보가 누락되었습니다." });
    }

    const result = await prodPlanService.insertProdPlan(planData);

    if (result.success) {
      res.status(201).json({
        message: "생산계획이 성공적으로 등록되었습니다.",
        data: result.data,
      });
    } else {
      res.status(500).json({
        error: "생산계획 등록 중 오류가 발생했습니다.",
        details: result.error,
      });
    }
  } catch (error) {
    console.error("생산계획 등록 라우트 오류:", error);
    res.status(500).json({ error: "생산계획 등록 중 오류가 발생했습니다." });
  }
});

module.exports = router;
