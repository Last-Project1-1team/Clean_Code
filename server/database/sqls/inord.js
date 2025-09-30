// Table : TB_MODEL_MASTER
// 각 변수별로 SQL문을 등록할 떄 백틱(``)을 사용하는 이유는 줄바꿈 허용을 허용하기 떄문.
// ( 따옴표는 줄을 바꿀 경우 값이 깨지면서 에러발생 )

// 조건없이 전체조회
const selectInordList = `SELECT     INORD_NO 
            STATUS
            CUST_CODE
            LOT_NO
            TOTAL_QTY
            INORD_DATE
            PAPRD_DATE
            CREATED_BY
            CREATE_DATE	
            UPDATED_BY
            UPDATE_DATE
  FROM      TB_INORD_DETAIL
  ORDER BY  INORD_NO`;
// PRIMARY KEY를 활용한 단건조회 -> 제품master 관리에서 단건 조회는 pk로 하는게 아니라 제품코드, 리비전, 제품명으로 하는거니까 확인
const selectInordOne = `SELECT   INORD_NO 
          STATUS
          CUST_CODE
          LOT_NO
          TOTAL_QTY
          INORD_DATE
          PAPRD_DATE
          CREATED_BY
          CREATE_DATE	
          UPDATED_BY
          UPDATE_DATE
  FROM    TB_INORD_DETAIL
  WHERER  CUST_CODE 업체코드
          업체명
          제품코드
          리비전
          제품명
  ORDER BY INORD_NO`;
// 등록
const inserinord = `
INSERT 	TB_INORD_DETAIL (
		      업체코드,

          `;

// 수정

module.exports = {};
