// env 파일을 읽어들이는 코드 => 가능한 가장 첫번쨰 줄에 작성
require("dotenv").config({ path: "./database/dbConfig.env" });

const express = require("express");
const app = express();

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

// 🔹 부서 목록 API
app.get('/userAccount/department', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT dept_id, dept_name FROM department');
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '부서 조회 실패' });
  }
});

// 🔹 직급 목록 API
app.get('/userAccount/workGrade', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT grade_id, grade_name FROM work_grade');
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '직급 조회 실패' });
  }
});

// 서버 실행
app.listen(8090, () => {
  console.log('✅ Server running on http://localhost:8090');
});


// 라우팅 등록 영역
const modelRouter = require("./routers/model_router.js");
const itemRouter = require("./routers/item_router.js");
const inordRouter = require("./routers/inord_router.js");
const accountRouter = require("./routers/account_router.js");
const workOrderRouter = require("./routers/workOrder_router.js");

// 기본 라우팅
app.get("/", (req, res) => {
  res.send("Welcome!!");
});
// 라우터 모듈 등록
app.use("/", modelRouter);
app.use("/", itemRouter);
app.use("/", inordRouter);
app.use("/", accountRouter);
app.use("/", workOrderRouter);