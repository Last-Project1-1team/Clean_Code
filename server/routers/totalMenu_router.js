const express = require("express");
const router = express.Router();
const totalService = require("../services/totalMenu_service.js");

// 라우팅 등록 영역

//대메뉴 전체조회
router.get("/totalMenu/viewAll", async (req, res) => {
  let totalList = await totalService.findAll().catch((err) => console.log(err));

  res.send(totalList);
});

// ✅ 대메뉴 선택 시 소메뉴조회
router.get("/totalMenu/subMenus", async (req, res) => {
  try {
    const { bMenuCode } = req.query;
    console.log("라우터로 전달된 bMenuCode:", bMenuCode);

    const subMenus = await totalService.findSubMenu(bMenuCode);
    res.json(subMenus);
  } catch (err) {
    console.error("소메뉴 조회 실패:", err);
    res.status(500).json({ error: "소메뉴 조회 실패" });
  }
});

// 대메뉴 저장
router.post("/totalMenu/insertBMenu", async (req, res) => {
  const { bMenuCode, bMenuName } = req.body;

  try {
    await totalService.addNewBMenu({
      bMenuCode,
      bMenuName,
    });

    // 응답 명확하게 보내기
    res.status(200).json({
      success: true,
      message: "대메뉴가 성공적으로 저장되었습니다.",
    });
  } catch (error) {
    console.error("대메뉴 저장 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류로 저장에 실패했습니다.",
      error: error.message,
    });
  }
});

// 소메뉴 저장
router.post("/totalMenu/insertSMenu", async (req, res) => {
  const { bMenuCode, sMenuCode, sMenuName, programName } = req.body;

  try {
    await totalService.addNewSMenu({
      bMenuCode,
      sMenuCode,
      sMenuName,
      programName,
    });

    // 응답 명확하게 보내기
    res.status(200).json({
      success: true,
      message: "소메뉴가 성공적으로 저장되었습니다.",
    });
  } catch (error) {
    console.error("소메뉴 저장 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류로 저장에 실패했습니다.",
      error: error.message,
    });
  }
});

module.exports = router;
