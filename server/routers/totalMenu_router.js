const express = require("express");
const router = express.Router();
const totalService = require("../services/totalMenu_service.js");


// 라우팅 등록 영역

//대메뉴 전체조회
router.get("/totalMenu/viewAll", async (req, res) => {
  let totalList = await totalService
  .findAll()
  .catch((err) => console.log(err));

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

// 등록
router.post("/totalMenu/insert", async (req, res) => {
  const { bMenuCode, bMenuName, sMenuCode, sMenuName, programName } = req.body;

  // 대메뉴 저장
  await totalService.addNewBMenu({ bMenuCode, bMenuName });

  // 소메뉴 저장
  const result = await totalService.addNewSMenu({
    bMenuCode,
    sMenuCode,
    sMenuName,
    programName,
  });

  res.send(result);
});

module.exports = router;
