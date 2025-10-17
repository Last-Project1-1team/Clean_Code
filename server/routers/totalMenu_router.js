const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리

const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴

const menuService = require("../services/totalMenu_service.js");
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data)

// 실제 라우팅 등록 영역

//전체조회
router.get("/totalMenu", async (req, res) => {
  let totalList = await menuService.findAll().catch((err) => console.log(err));

  res.send(totalList);
});

// 등록
router.post("/totalMenu/insert", async (req, res) => {
  let selectMenuInfo = req.body;
  let result = await menuService
    .addNewMenu(selectMenuInfo)
    .catch((err) => console.log(err));
  res.send(result);
});

module.exports = router;
