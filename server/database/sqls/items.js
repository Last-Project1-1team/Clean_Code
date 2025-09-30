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
module.exports = {
    selectItemList,
    selectClass,
    selectUnit,
    insertItems,
};
