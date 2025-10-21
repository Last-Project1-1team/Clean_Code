// env 파일을 읽어들이는 코드 => 가능한 가장 첫번쨰 줄에 작성
require("dotenv").config({ path: "./database/dbConfig.env" });

const express = require("express");
const app = express();
const path = require("path");

// 미들웨어 등록 영역
// 1. body parser
// content-type : application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// content-type : application/json
app.use(express.json());
// Server 실행
app.listen(3000, () => {
    console.log("Server Start");
    console.log("http://localhost:3000");
});

// 라우팅 등록 영역
const modelRouter = require("./routers/model_router.js");
const itemRouter = require("./routers/item_router.js");
const inordRouter = require("./routers/inord_router.js");
const accountRouter = require("./routers/account_router.js");
const workOrderRouter = require("./routers/workOrder_router.js");
const commonRouter = require("./routers/common_router.js");
const totalMenuRouter = require("./routers/totalMenu_router.js");
const codeGroupRouter = require("./routers/codeGroup_router.js");
const resultWorkRouter = require("./routers/resultWork_router.js");
const shiopRouter = require("./routers/ship_router.js");

const receivingRouter = require("./routers/receiving_router.js");
const prodPlan = require("./routers/prodPlan_router.js");

// ✅ Vue build 결과물이 복사될 실제 폴더와 일치시킴
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// // ✅ SPA 라우팅 처리 (Vue router 지원)
// app.get("/", (req, res) => {
//     res.sendFile(path.join(publicPath, "index.html"));
// });

// 기본 라우팅
// 라우터 모듈 등록
app.use("/", modelRouter);
app.use("/", itemRouter);
app.use("/", inordRouter);
app.use("/", accountRouter);
app.use("/", workOrderRouter);
app.use("/", commonRouter);
app.use("/", totalMenuRouter);
app.use("/", codeGroupRouter);
app.use("/", resultWorkRouter);
app.use("/", shiopRouter);

app.use("/", receivingRouter);

app.use("/", prodPlan);

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
