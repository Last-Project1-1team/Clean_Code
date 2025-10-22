// 조건없이 업체 전체조회
const selectInordList = `
SELECT    CUST_CODE
        ,  CUST_NAME
        ,  PSCH_PHONE
  FROM     TB_CUST
  ORDER BY CUST_CODE`;

// 등록
const insertInordMaster = `
    INSERT INTO tb_inord_master 
        ( inord_no
        , inord_date
        , cust_code
        , paprd_date
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

const insertInordDetail = ` 
    INSERT INTO tb_inord_detail 
      (inord_detail_no
     , inord_no
     , model_code
     , revision
     , inord_qty
     , created_by
     , create_date)
    VALUES 
      (?
     , ?
     , ?
     , '0'
     , ?
     , ?
     , NOW())
  `;

// 수주번호 가져오기
const selectLastInordNo = `
    SELECT INORD_NO 
      FROM TB_INORD_MASTER 
     WHERE INORD_NO LIKE ?
     ORDER BY INORD_NO DESC
     LIMIT 1
  `;

// 수주단건조회
const selectInord = `
SELECT 	MAS.CUST_CODE
		  , C.CUST_NAME
      , DET.MODEL_CODE
      , MM.MODEL_NAME
      , MM.REVISION
      , DET.INORD_QTY
      , to_char(MAS.INORD_DATE, 'YYYY-MM-DD') INORD_DATE 
      , TO_CHAR(MAS.PAPRD_DATE, 'YYYY-MM-DD') PAPRD_DATE
FROM	TB_INORD_MASTER MAS JOIN TB_INORD_DETAIL DET ON	MAS.INORD_NO = DET.INORD_NO
                          JOIN TB_MODEL_MASTER MM	 ON DET.MODEL_CODE = MM.MODEL_CODE
                          JOIN TB_CUST C			     ON MAS.CUST_CODE = C.CUST_CODE
WHERE   ( ? IS NULL OR MAS.CUST_CODE LIKE ? )
  AND   ( ? IS NULL OR MAS.INORD_DATE = STR_TO_DATE(?, '%Y-%m-%d') )
`;

// 삭제
const deleteinorddetail = `DELETE TB_INORD_DETAIL
WHERE CUST_CODE= ?`;

const deleteinordmaster = `DELETE TB_INORD_MASTER
WHERE MODEL_CODE = ?`;

module.exports = {
  selectInordList,
  insertInordMaster,
  insertInordDetail,
  selectLastInordNo,
  selectInord,
};
