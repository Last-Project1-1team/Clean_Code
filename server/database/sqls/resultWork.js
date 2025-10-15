const selectWorkOrd = `
SELECT wo.work_ord_no workOrdNo,
       wo.model_code modelCode,
       wo.revision,
       m.model_name modelName,
       wo.proc_code,
       c.code_name proc,
       wo.work_ord_qty workOrdQty
FROM tb_work_ord wo
JOIN tb_model_master m
  ON (wo.model_code = m.model_code
 AND wo.revision = m.revision)
JOIN tb_code c
  ON (wo.proc_code = c.common_code)
WHERE wo.work_ord_no LIKE ?
`;

const selectLotNo = `
SELECT  wor.model_code modelCode,
        wor.revision,
        itm.item_code itemCode,
        wor.work_ord_qty,
        bom.need_qty,
        wor.work_ord_qty * bom.need_qty needQty,
        cod.code_name
FROM tb_work_ord wor
JOIN v_bom bom
  ON (wor.model_code = bom.root_code
 AND wor.revision = bom.root_revision
 AND wor.model_code = bom.upper_code
 AND wor.revision = bom.upper_revision)
JOIN v_item_master itm
  ON (bom.low_code = itm.item_code
 AND bom.low_revision = itm.revision)
JOIN tb_code cod
  ON (wor.proc_code = cod.common_code)
WHERE wor.model_code LIKE ?
  AND wor.revision LIKE ?
`;
module.exports = {
  selectWorkOrd,
};
