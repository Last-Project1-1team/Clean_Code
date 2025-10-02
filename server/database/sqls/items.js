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

module.exports = {
    selectItemList,
    selectClass,
    selectUnit,
    insertItems,
    itemOutordSelect,
};
