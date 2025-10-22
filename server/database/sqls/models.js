// Table : TB_MODEL_MASTER
// 각 변수별로 SQL문을 등록할 떄 백틱(``)을 사용하는 이유는 줄바꿈 허용을 허용하기 떄문.
// ( 따옴표는 줄을 바꿀 경우 값이 깨지면서 에러발생 )

// 조건없이 전체조회
const selectAllModelList = `
SELECT m.model_code modelCode,
		    m.revision,
        m.model_name modelName,
        m.model_flag modelFlag,
       c1.code_name modelFlagName,
        m.lot_p_qty lotPQty,
        m.model_class modelClass,
        m.spec,
        m.wid,
        m.hei,
        m.unit
FROM tb_model_master m
JOIN tb_code c1
  ON (m.model_flag = c1.common_code
 AND c1.group_code = 'model_flag')
WHERE m.model_code LIKE ?
  AND m.revision LIKE ?
  AND m.model_name LIKE ?
ORDER BY m.model_code
`;

// 완/반제 model_flag
const selectModelFlag = `SELECT common_code code,
        code_name name
  FROM tb_code
  WHERE group_code = 'model_flag'`;

// 단위  unit
const selectUnit = `
SELECT common_code code,
       code_name
FROM tb_code
WHERE group_code = 'unit';
`;

// 등록
const insertModel = `
INSERT INTO tb_model_master
(model_code,
revision,
model_name,
model_flag,
lot_p_qty,
spec,
wid,
hei,
unit)
VALUES
(?,
?,
?,
?,
?,
?,
?,
?,
?)
ON DUPLICATE KEY UPDATE
revision = VALUES(revision),
model_name = VALUES(model_name),
model_flag = VALUES(model_flag),
lot_p_qty = VALUES(lot_p_qty),
spec = VALUES(spec),
wid = VALUES(wid),
hei = VALUES(hei),
unit = VALUES(unit)
`;

const modalSearch = `
SELECT model_code,
       model_name,
       revision
FROM tb_model_master
`;

module.exports = {
  selectAllModelList,
  selectModelFlag,
  selectUnit,
  insertModel,
  modalSearch,
};
