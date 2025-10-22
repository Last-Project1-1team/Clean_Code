// Table : tb_work_ord, tb_prod_plan

// 공정, 생산계획 일자로 조회하는 걸로 변경 where절 수정하기
const selectProdPlan = `
SELECT 
    p.prod_plan_no AS prodPlanNo,
    DATE_FORMAT(p.create_date, '%Y-%m-%d') AS prodPlanDate,
    p.model_code AS modelCode,
    p.revision,
    m.model_name AS modelName,
    r.proc_code AS procCode,
    c.code_name AS procCodeName,
    m.unit,
    p.plan_qty planQty
FROM tb_prod_plan p
JOIN tb_model_master m
  ON p.model_code = m.model_code
 AND p.revision = m.revision
JOIN tb_proc_routing r
  ON r.model_code = m.model_code
 AND r.revision = m.revision
 AND r.proc_seq = (
      SELECT MAX(r2.proc_seq)
      FROM tb_proc_routing r2
      WHERE r2.model_code = m.model_code
        AND r2.revision = m.revision
  )
JOIN tb_code c
  ON c.common_code = r.proc_code
WHERE r.proc_code LIKE ?
  AND TO_CHAR(p.create_date, 'YYYY-MM-DD') LIKE ?
ORDER BY p.create_date, m.model_code, m.revision, p.prod_plan_no
`;

// 생산계획번호
// const selectProdPlanNo = `
// SELECT prod_plan_no prodPlanNo
// FROM tb_prod_plan
// WHERE LOWER(prod_plan_no) LIKE LOWER(?)
// `;

const insertWorkOrder = `
INSERT INTO tb_work_ord
(work_ord_no,
model_code,
revision,
proc_code,
work_ord_qty,
prod_plan_no
)
VALUES
(?,
?,
?,
?,
?,
?)
`;

// 시퀀스 만들기 위한 작업지시번호 조회
const selectLastWorkOrdNo = `
SELECT work_ord_no
  FROM tb_work_ord
 ORDER BY work_ord_no DESC
 LIMIT 1
`;

// 공정 select
const selectProc = `
SELECT common_code code,
       code_name name
FROM tb_code
WHERE group_code = 'proc'
`;

module.exports = {
  selectProdPlan,
  insertWorkOrder,
  selectLastWorkOrdNo,
  selectProc,
};
