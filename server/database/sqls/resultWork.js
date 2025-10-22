const selectWorkOrd = `
SELECT wo.work_ord_no workOrdNo,
       wo.model_code modelCode,
       wo.revision,
       m.model_name modelName,
       pr.proc_code,
       c.code_name proc,
       wo.work_ord_qty workOrdQty
FROM tb_work_ord wo
JOIN tb_model_master m
  ON (wo.model_code = m.model_code
 AND wo.revision = m.revision)
JOIN tb_proc_routing pr
  ON (wo.model_code = pr.model_code
 AND wo.revision = pr.revision)
JOIN tb_code c
  ON (pr.proc_code = c.common_code)
WHERE wo.work_ord_no LIKE ?
  AND pr.proc_seq <= (
      SELECT MAX(routing.proc_seq)
      FROM tb_proc_routing routing
      WHERE routing.model_code = wo.model_code
        AND routing.revision = wo.revision
        AND routing.proc_code = wo.proc_code
  )
  AND wo.work_qty IS NULL
ORDER BY pr.proc_seq, wo.work_ord_no
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
  AND wor.work_ord_no LIKE ?
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
WHERE lot.item_code LIKE ?
  AND lot.use_yn = 'Y'
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
WHERE itm.item_code LIKE ?
  AND plot.use_yn = 'Y'
`;

// 생산계획번호 조회용 쿼리
const selectLastProdLotNo = `
SELECT prod_lot_no
  FROM tb_prod_lot
 ORDER BY prod_lot_no DESC
 LIMIT 1
`;

const insertProdResult = `
INSERT INTO tb_prod_result
(work_ord_no,
 model_code,
 revision,
 proc_code,
 status,
 work_start_time)
VALUES
(?,
?,
?,
?,
?,
?)
`;

const updatePause = `
UPDATE tb_prod_result
SET work_qty = ?,
    status= ?,
    work_end_time = ?
WHERE work_ord_no = ?
  AND proc_code = ?
  AND status = 'IN_PROGRESS'
`;

const updateEnd = `
UPDATE tb_prod_result
SET proc_code = ?,
    work_qty = ?,
    status= ?,
    work_end_time = ?
WHERE work_ord_no = ?
  AND status = 'START'
`;
module.exports = {
  selectWorkOrd,
  selectBom,
  selectLot,
  insertProdResult,
  updatePause,
  updateEnd,
};
