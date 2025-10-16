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

const selectBom = `
SELECT  wor.work_ord_no workOrdNo,
        wor.model_code modelCode,
        wor.revision,
        itm.item_code itemCode,
        itm.item_name itemName,
        wor.work_ord_qty,
        bom.need_qty,
        wor.work_ord_qty * bom.need_qty needQty,
        (SELECT code_name
           FROM tb_code 
          WHERE itm.unit = common_code
            AND group_code = 'unit') unit
FROM tb_work_ord wor
JOIN v_bom bom
  ON (wor.model_code = bom.root_code
 AND wor.revision = bom.root_revision
 AND wor.model_code = bom.upper_code
 AND wor.revision = bom.upper_revision)
JOIN v_item_master itm
  ON (bom.low_code = itm.item_code
 AND bom.low_revision = itm.revision)
WHERE wor.model_code LIKE ?
  AND wor.revision LIKE ?
ORDER BY itm.item_code, wor.model_code
`;

const selectLot = `
SELECT lot.lot_no lotNo,
       itm.item_code itemCode,
       '' revision,
       itm.item_name itemName,
       lot.lot_qty lotQty,
       (SELECT code_name
           FROM tb_code 
          WHERE itm.unit = common_code
            AND group_code = 'unit') unit
FROM tb_lot lot
JOIN v_item_master itm
  ON (lot.item_code = itm.item_code)
WHERE lot.lot_no LIKE ?
UNION ALL
SELECT plot.prod_lot_no lotNo,
       itm.item_code itemCode,
       itm.revision,
       itm.item_name itemName,
       plot.lot_qty lotQty,
       (SELECT code_name
           FROM tb_code 
          WHERE itm.unit = common_code
            AND group_code = 'unit') unit
FROM tb_prod_lot plot
JOIN v_item_master itm
  ON (plot.model_code = itm.item_code)
WHERE plot.prod_lot_no LIKE ?
`;

const insertProdResult = `
INSERT INTO tb_prod_result
(work_ord_no,
 model_code,
 revision,
 proc_code,
 work_qty,
 work_start_time)
VALUES
(?,
?,
?,
?,
?,
?)
ON DUPLICATE KEY UPDATE
work_start_time = VALUES(work_start_time),
work_end_time = VALUES(work_end_time)
`;

const updateEndTime = `
UPDATE tb_prod_result
SET work_end_time LIKE ?
WHERE work_ord_no LIKE ?
`;
module.exports = {
  selectWorkOrd,
  selectBom,
  selectLot,
  insertProdResult,
  updateEndTime,
};
