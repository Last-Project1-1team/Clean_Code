const selectItemList =
    //
    `SELECT itm.item_code itemCode
        , itm.item_name itemName
        , itm.spec spec
        , itm.item_class itemClass
        , cod1.code_name itemClassName
        , itm.unit unit
        , cod2.code_name unitName
        , itm.lot_p_qty lotPQty
        , itm.ea_p_qty eaPQty
        , itm.safety_stock safetyStock
        , itm.use_yn useYn
     FROM tb_item_master itm
     JOIN tb_code cod1
       ON (itm.item_class = cod1.common_code
      AND cod1.group_code = 'item_class')
     JOIN tb_code cod2
       ON (itm.unit = cod2.common_code
      AND cod2.group_code = 'unit')
    WHERE itm.item_code LIKE ?
      AND itm.item_name LIKE ?`;
const selectClass =
    //
    `SELECT common_code code
          , code_name name
       FROM tb_code
      WHERE group_code = 'item_class'`;
const selectUnit =
    //
    `SELECT common_code code
          , code_name name
       FROM tb_code
      WHERE group_code = 'unit'`;

const insertItems = `
    INSERT INTO tb_item_master 
        ( item_code
        , item_name
        , spec
        , item_class
        , unit
        , lot_p_qty
        , ea_p_qty
        , safety_stock
        , use_yn)
    values 
        ( ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?)
    ON DUPLICATE KEY UPDATE
        item_name    = VALUES(item_name)
        , spec         = VALUES(spec)
        , item_class   = VALUES(item_class)
        , unit         = VALUES(unit)
        , lot_p_qty    = VALUES(lot_p_qty)
        , ea_p_qty     = VALUES(ea_p_qty)
        , safety_stock = VALUES(safety_stock)
        , use_yn       = VALUES(use_yn);
`;

const itemOutordSelect = `
    SELECT itm.item_code itemCode
        , itm.item_name itemName
        , itm.spec spec
        , itm.unit unit
        , cod.code_name unitName
        , ifnull (tst.tot_qty, 0)  toalStockQty
        , ifnull (mst.mat_qty, 0)  itemStockQty
        , ifnull (pst.prd_qty, 0)  prodStockQty
        , itm.safety_stock safetyStockQty
        , ifnull (ppl.plan_qty, 0) prodPlanQty
        , ceil (greatest ((ifnull (ppl.plan_qty, 0) + itm.safety_stock) - ifnull (tst.tot_qty, 0), 0) / itm.lot_p_qty) * lot_p_qty outOrdQty
    FROM tb_item_master itm
    JOIN tb_code cod
      ON (itm.unit = cod.common_code
     AND cod.group_code = 'unit')
    LEFT OUTER JOIN (SELECT item_code
                            , SUM (lot_qty) tot_qty
                    FROM tb_lot
                    WHERE use_yn = 'Y'
                    GROUP BY item_code
                    )              tst
        ON itm.item_code = tst.item_code
    LEFT OUTER JOIN (SELECT item_code
                            , SUM (lot_qty) mat_qty
                    FROM tb_lot
                    WHERE use_yn = 'Y'
                        AND location = 'MAT_STOCK'
                    GROUP BY item_code
                    )              mst
        ON itm.item_code = mst.item_code
    LEFT OUTER JOIN (SELECT item_code
                            , SUM (lot_qty) prd_qty
                    FROM tb_lot
                    WHERE use_yn = 'Y'
                        AND location = 'PRD_STOCK'
                    GROUP BY item_code
                    )              pst
        ON itm.item_code = pst.item_code
    LEFT OUTER JOIN (SELECT itm.item_code
                            , SUM (ppl.plan_qty * bom.need_qty) plan_qty
                    FROM tb_prod_plan ppl
                    JOIN tb_bom         bom
                    ON ppl.model_code = bom.upper_code
                    JOIN tb_item_master itm
                    ON bom.low_code = itm.item_code
                    GROUP BY item_code
                    )              ppl
        ON itm.item_code = ppl.item_code
    WHERE itm.item_code like ?
    AND itm.item_name like ?
`;

const custOutordSelect = `
    SELECT cst.cust_code custCode
         , cst.cust_name custName
         , cst.psch_phone pschPhone
      FROM tb_cust cst
     WHERE cst.cust_code like ?
       AND cst.cust_name like ?
`;
const insertOutordMaster = `
    INSERT INTO tb_outord_master 
      (outord_no
     , outord_date
     , cust_code
     , delivery_date
     , status
     , created_by
     , create_date)
    VALUES 
      (?
     , STR_TO_DATE(?, '%Y-%m-%d')
     , ?
     , STR_TO_DATE(?, '%Y-%m-%d')
     , '0'
     , ?
     , NOW())
  `;

const insertOutordDetail = `
    INSERT INTO tb_outord_detail 
      (outord_detail_no
     , outord_no
     , item_code
     , outord_qty
     , created_by
     , create_date)
    VALUES 
      (?
     , ?
     , ?
     , ?
     , ?
     , NOW())
  `;

const selectLastOutordNo = `
    SELECT OUTORD_NO 
      FROM TB_OUTORD_MASTER 
     WHERE OUTORD_NO LIKE ?
     ORDER BY OUTORD_NO DESC
     LIMIT 1
  `;

const outordListSelect = `
 SELECT oom.outord_no outordNo
	  , oom.outord_date outordDate
	  , oom.cust_code custCode
	  , cst.cust_name custName
	  , oom.delivery_date deliveryDate
   FROM tb_outord_master oom
   JOIN tb_cust cst
	 ON oom.cust_code = cst.cust_code
  WHERE oom.outord_date = ?
    AND oom.status <> 9
    `;

const outorderDetailSelect = `
  SELECT ood.outord_detail_no outordDetailNo
       , ood.item_code itemCode
       , itm.item_name itemName
       , itm.spec spec
       , itm.unit unit
       , ood.input_qty eInputQty
       , ood.outord_qty outordQty
       , 0 inputQty
    FROM tb_outord_detail ood
    JOIN tb_item_master itm
      ON ood.item_code = itm.item_code
   WHERE ood.outord_no = ?
`;

const selectLastInputNo = `
    SELECT input_no 
      FROM tb_input 
     WHERE input_no LIKE ?
     ORDER BY input_no DESC
     LIMIT 1
  `;
const selectInputList = `
    SELECT inp.input_no inputNo
         , to_char(inp.input_date, 'YYYY-MM-DD') inputDate
         , inp.item_code itemCode
         , itm.item_name itemName
         , itm.spec spec
         , itm.unit unit
         , inp.input_qty inputQty
      FROM tb_input inp
      JOIN tb_item_master itm 
        ON inp.item_code = itm.item_code
     WHERE inp.status = 5
       AND inp.item_code like ?
       AND itm.item_name like ?;
`;

const selectOutputStock =
    //
    `SELECT common_code code
          , code_name name
       FROM tb_code
      WHERE group_code = 'STOCK'
        AND common_code <> '0H01'`;

const selectOutputLot =
    //
    ` SELECT lot.item_code itemCode
          , itm.item_name itemName
          , lot.lot_qty  lotQty
        FROM tb_lot lot 
        JOIN tb_item_master itm 
            ON lot.item_code = itm.item_code
        WHERE lot.lot_no = ?`;

const selectLastOutputNo = `
    SELECT output_no 
      FROM tb_output
     WHERE output_no LIKE ?
     ORDER BY output_no DESC
     LIMIT 1
  `;
module.exports = {
    selectItemList,
    selectClass,
    selectUnit,
    insertItems,
    itemOutordSelect,
    custOutordSelect,
    insertOutordMaster,
    insertOutordDetail,
    selectLastOutordNo,
    outordListSelect,
    outorderDetailSelect,
    selectLastInputNo,
    selectInputList,
    selectOutputStock,
    selectOutputLot,
    selectLastOutputNo,
};
