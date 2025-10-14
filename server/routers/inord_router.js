const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리
const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴
const inordService = require("../services/inord_service.js");
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data)

//업체전제조회
// 전체조회 : 자원(데이터) -> books / 조회 -> GET
router.get("/custselect", async (req, res) => {
  // 해당 엔드포인트(URL+METHOD)로 접속할 경우 제공되는 서비스를 실행
  // -> 서비스가 DB에 접속하므로 비동기 작업, await/async를 활용해서 동기식으로 동작하도록 진행
  let custlist = await inordService
    .findinordAll()
    .catch((err) => console.log(err));
  // res(Http Response에 대응되는 변수)의 응답메소드를 호출해 데이터를 반환하거나 통신을 종료
  // 주의) res(Http Response에 대응되는 변수)의 응답메소드를 호출하지 않으면
  //       통신이 종료되지 않음
  // res.send()는 데이터를 반환하는 응답 메소드며 객체를 반환하므로 JSON으로 자동 변환
  res.send(custlist);
});
//
//
// // 수주마스터등록    : 자원(데이터) -> books / 등록 -> POST
// router.post("/insertinsert", async (req, res) => {
//   // METHOD 중 POST와 PUT은 Http Request의 Body 영역을 가지며 req(Http Request에 대응되는 변수)의 body 속성에 등록됨
//   let masterinfo = req.body;
//   // console.log(inordinfo);
//   let result = await inordService
//     .addNewinord(masterinfo)
//     .catch((err) => console.log(err));
//   res.send(result);

//   const detailinfo = req.body;
//   // console.log(inordinfo);
//   let result1 = await inordService
//     .addNewinord(detailinfo)
//     .catch((err) => console.log(err));
//   res.send(result1);
// });
//
//
// 수주등록
router.post("/insertinord", async (req, res) => {
  const { orderDate, paprdDate, custCode, custName, models } = req.body;

  try {
    const result = await inordService.addNewInord(
      orderDate,
      paprdDate,
      custCode,
      models
    );
    res.status(200).json({
      message: "수주정보 저장 성공",
      inordNo: result.inordNo,
      modelCount: result.modelCount,
    });
  } catch (error) {
    console.error("❌ 수주 저장 실패:", error);
    res.status(500).json({
      message: "수주정보 저장 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// 해당 javascript 파일의 마지막 코드, 모듈화
// 위에 선언한 기능(변수, 함수 등)들 중 외부로 노출할 대상을 설정
// => 다른 파일에서 require()을 통해 가져옴
module.exports = router;
