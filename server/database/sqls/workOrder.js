// Table : tb_work_ord, tb_prod_plan

// 생산계획번호를 조회해서 그리드에 출력 , 공통코드에 공정코드 그룹 만들고 나서 공정 관련 코드 다 추가해야함, 단위도
const selectProdPlan = `
SELECT 
        p.prod_plan_no prodPlanNo,
        TO_CHAR(p.create_date,'YYYY-MM-dd') prodPlanDate,
        p.model_code modelCode,
        p.revision,
        m.model_name modelName
FROM tb_prod_plan p
JOIN tb_model_master m
  ON (p.model_code = m.model_code
  AND p.revision = m.revision)
WHERE LOWER(p.prod_plan_no) LIKE LOWER(?)
`;

const selectProdPlanNo = `
SELECT prod_plan_no prodPlanNo
FROM tb_prod_plan
WHERE LOWER(prod_plan_no) LIKE LOWER(?)
`;

// 작업지시 테이블에 등록할때 작업지시번호, 중복되는 모델 row 처리 생각하기.

const insertWorkOrder = `
INSERT INTO tb_work_ord
(work_ord_qty,
model_code,
revision,
model_name 
)
VALUES
(?,
?,
?,
?)
`;

module.exports = {
  selectProdPlan,
  selectProdPlanNo,
  insertWorkOrder,
};
