// Table : TB_MODEL_MASTER
// 각 변수별로 SQL문을 등록할 떄 백틱(``)을 사용하는 이유는 줄바꿈 허용을 허용하기 떄문.
// ( 따옴표는 줄을 바꿀 경우 값이 깨지면서 에러발생 )

// 조건없이 전체조회
const selectAllModelList = `
SELECT model_code,
		    revision,
        model_name,
        model_flag,
        lot_p_qty,
        model_class,
        spec,
        wid,
        hei
FROM tb_model_master
ORDER BY model_code;
`;
// PRIMARY KEY를 활용한 단건조회 -> 제품master 관리에서 단건 조회는 pk로 하는게 아니라 제품코드, 리비전, 제품명으로 하는거니까 확인
const selectModelOne = ``;
// 등록
const ModelInsert = ``;
// 수정
const ModelUpdate = ``;

module.exports = {
  selectAllModelList,
  selectModelOne,
  ModelInsert,
  ModelUpdate,
};
