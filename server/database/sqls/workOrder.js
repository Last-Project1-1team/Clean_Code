// Table : tb_work_ord

// 생산계획번호를 조회해서 그리드에 출력 = WHERE prod_plan_no = ?
const selectWorkOrder = `
SELECT p.create_date prodPlanDate,
        p.model_code modelCode,
        p.revision,
        p.model_name modelName,
        proc,
        ord.work_ord_qty workOrdQty,
        unit
FROM tb_work_ord ord
JOIN tb_prod_plan p
  ON (p.prod_plan_no = ord.prod_plan_no)
WHERE prod_plan_no = ?
`;

module.exports = {
  selectWorkOrder,
};
