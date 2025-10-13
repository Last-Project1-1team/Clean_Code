// Table : tb_work_ord, tb_prod_plan

// 공정, 생산계획 일자로 조회하는 걸로 변경 where절 수정하기
const selectProdPlan = `
SELECT 
        p.prod_plan_no prodPlanNo,
        DATE_FORMAT(p.create_date, '%Y-%m-%d') prodPlanDate,
        p.model_code modelCode,
        p.revision,
        m.model_name modelName,
        r.proc_code procCode,
        c.code_name procCodeName,
        m.unit
FROM tb_prod_plan p
JOIN tb_model_master m
  ON (p.model_code = m.model_code
 AND p.revision = m.revision)
JOIN tb_proc_routing r
  ON (m.model_code = r.model_code
 AND m.revision = r.revision)
JOIN tb_code c
  ON (c.common_code = r.proc_code)
WHERE r.proc_code LIKE ?
  
ORDER BY r.proc_seq DESC
`;

// 생산계획번호
// const selectProdPlanNo = `
// SELECT prod_plan_no prodPlanNo
// FROM tb_prod_plan
// WHERE LOWER(prod_plan_no) LIKE LOWER(?)
// `;

// 작업지시 테이블에 등록할때 작업지시번호, 중복되는 모델 row 처리 생각하기.

const insertWorkOrder = `
INSERT INTO tb_work_ord
(work_ord_no,
model_code,
revision,
work_ord_qty
)
VALUES
(?,
?,
?,
?)
`;

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
