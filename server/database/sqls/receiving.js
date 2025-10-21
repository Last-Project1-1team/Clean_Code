const selectLotInfo = `
SELECT 
	l.lot_no lotNo,
    l.item_code itemCode,
    i.item_name itemName,
    l.lot_qty lotQty
    l.location,
    l.status
FROM tb_lot l
JOIN tb_item_master i 
ON l.item_code = i.item_code
WHERE l.lot_no = ?
 `;

module.exports = {
  selectLotInfo,
};
