const selectWorkOrd = `
SELECT wo.work_ord_no,
       wo.model_code,
       wo.revision,
       m.model_name,
       wo.proc_code,
       c.code_name proc,
       wo.work_ord_qty
FROM tb_work_ord wo
JOIN tb_model_master m
  ON (wo.model_code = m.model_code)
JOIN tb_code c
  ON (wo.proc_code = c.common_code)
WHERE wo.work_ord_no LIKE ?
`;

module.exports = {
  selectWorkOrd,
};
