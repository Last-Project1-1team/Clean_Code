// Table : TB_MODEL_MASTER
// 각 변수별로 SQL문을 등록할 떄 백틱(``)을 사용하는 이유는 줄바꿈 허용을 허용하기 떄문.
// ( 따옴표는 줄을 바꿀 경우 값이 깨지면서 에러발생 )

// 조건없이 전체조회
const selectAllModelList = `
SELECT m.model_code modelCode,
		    m.revision,
        m.model_name modelName,
       c1.code_name modelFlag,
        m.lot_p_qty lotPQty,
        m.model_class modelClass,
        m.spec,
        m.wid width,
        m.hei height
FROM tb_model_master m
JOIN tb_code c1
  ON (m.model_flag = c1.common_code
 AND c1.group_code = 'model_flag')
WHERE m.model_code like ?
  AND m.revision like ?
  AND m.model_name like ?
ORDER BY m.model_code
`;

const selectModelFlag = `SELECT common_code code,
        code_name name
  FROM tb_code
  WHERE group_code = 'model_flag'`;

// PRIMARY KEY를 활용한 단건조회 -> 제품master 관리에서 단건 조회는 pk로 하는게 아니라 제품코드, 리비전, 제품명으로 하는거니까 확인
const selectModelOne = ``;
// 등록
const ModelInsert = ``;
// 수정
const ModelUpdate = ``;

module.exports = {
  selectAllModelList,
  selectModelFlag,
  selectModelOne,
  ModelInsert,
  ModelUpdate,
};
