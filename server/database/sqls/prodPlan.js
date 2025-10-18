const searchProdPlan = `
SELECT DATE_FORMAT(p.create_date, '%Y-%m-%d') regPlanDate,
       DATE_FORMAT(p.start_date, '%Y-%m-%d') startPlanDate,
       DATE_FORMAT(p.end_date, '%Y-%m-%d') endPlanDate,
       p.model_code modelCode,
       p.revision,
       p.proc_code procCode,
       c.code_name procName,
       m.model_name modelName,
       m.unit,
       p.plan_qty planQty
FROM tb_prod_plan p
JOIN tb_code c
  ON (p.proc_code = c.common_code
 AND c.group_code = 'proc')
JOIN tb_model_master m
  ON (p.model_code = m.model_code
 AND p.revision = m.revision)
WHERE p.create_date LIKE ?
  AND p.start_date LIKE ?
  AND p.end_date LIKE ?
  AND p.model_code LIKE ?
  AND p.revision LIKE ?
  AND p.proc_code LIKE ?
`;

// 공정 select
const selectProc = `
SELECT common_code code,
       code_name name
FROM tb_code
WHERE group_code = 'proc'
`;

module.exports = {
  searchProdPlan,
  selectProc,
};
