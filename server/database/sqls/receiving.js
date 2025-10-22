const selectLotInfo = `
SELECT 
	  l.lot_no lotNo,
    l.item_code itemCode,
    i.item_name itemName,
    l.lot_qty lotQty,
    l.location,
    l.status,
    c.code_name locationName
FROM tb_lot l
JOIN tb_item_master i 
  ON l.item_code = i.item_code
JOIN tb_code c
  ON l.location = c.common_code
WHERE l.lot_no = ?
 `;

const updateLotStatus = `
UPDATE tb_lot
SET status = 0
WHERE lot_no = ?
`;
module.exports = {
  selectLotInfo,
  updateLotStatus,
};
