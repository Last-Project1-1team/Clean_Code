// 조건없이 전체조회
const selectInordList = `SELECT     
  FROM      
  ORDER BY  `;
// PRIMARY KEY를 활용한 단건조회 -> 제품master 관리에서 단건 조회는 pk로 하는게 아니라 제품코드, 리비전, 제품명으로 하는거니까 확인
const selectInordOne = ``;

// 시퀀스 호출
const

// 등록
const insertinordmaster = `
INSERT INTO tb_inord_master
        ( inord_no
        , status
        , cust_code
        , total_qty
        , inord_date
        , paprd_date) 
VALUES
        ( ?
        , ?
        , ?
        , ?
        , ?
        , ?);
`;

const insertinorddetail = `
INSERT INTO tb_inord_detail
        ( inord_detail_no
        , inord_no
        , model_code
        , revision
        , inord_qty)
VALUES
        ( ?
        , ?
        , ?
        , ?
        , ?)
`;

// 수정

// 삭제
const deleteinorddetail = `DELETE TB_INORD_DETAIL
WHERE CUST_CODE= ?`;

const deleteinordmaster = `DELETE TB_INORD_MASTER
WHERE MODEL_CODE = ?`;

module.exports = {
  inserinordmaster,
  insertinorddetail,
};
