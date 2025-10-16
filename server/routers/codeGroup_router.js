const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리

const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴

const groupService = require("../services/codeGroup_service.js");
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data)

// 실제 라우팅 등록 영역

//전체조회
router.get("/codeGroup", async (req, res) => {
  let groupCode = req.query.groupCode;

  let groupList = await groupService
    .findAll(groupCode)
    .catch((err) => console.log(err));

  res.send(groupList);
});

//코드그룹조회
router.get("/codeGroup/groupId", async (req, res) => {
  let groupList = await groupService
    .findGroup()
    .catch((err) => console.log(err));
  res.send(groupList);
});

// 등록
router.post("/codeGroup/insert", async (req, res) => {
  let selectGroupInfo = req.body;
  console.log(selectGroupInfo);
  let result = await groupService
    .addNewGroup(selectGroupInfo)
    .catch((err) => console.log(err));
  res.send(result);
});

module.exports = router;
