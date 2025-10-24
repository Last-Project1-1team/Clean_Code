const shipmodel = `
SELECT    MAS.inord_no INORD_NO
        , C.cust_name
        , C.CUST_CODE
        , DET.MODEL_CODE
        , DET.REVISION
        , S.INORD_NO
FROM	TB_INORD_MASTER MAS JOIN TB_INORD_DETAIL DET ON	MAS.INORD_NO = DET.INORD_NO
							            JOIN TB_CUST C 			     ON	MAS.cust_code = C.cust_code
WHERE 	MAS.INORD_NO = ?`;

const shipinordmatch = `
SELECT 	  s.inord_no
	    	, i.inord_no
FROM	TB_SHIP_MASTER S JOIN TB_INORD_MASTER I ON S.INORD_NO = i.inord_no
WHERE	s.inord_no = ?`;

const lotnoscan = `
SELECT 	L.PROD_LOT_NO
      , L.MODEL_CODE MODEL_CODE
      , M.REVISION
      , M.MODEL_NAME MODEL_NAME
      , L.LOT_QTY 
      , M.SPEC SPEC
      , M.UNIT
FROM	TB_PROD_LOT L JOIN TB_MODEL_MASTER M       ON L.MODEL_CODE = M.MODEL_CODE
WHERE	L.PROD_LOT_NO = ?`;

//발주번호 가져오기
const selectLastShipNo = `
    SELECT SHIP_NO 
      FROM TB_SHIP_MASTER 
     WHERE SHIP_NO LIKE ?
     ORDER BY SHIP_NO DESC
     LIMIT 1
  `;

const insertshipmaster = `
INSERT INTO tb_ship_master 
        ( ship_no
        , cust_no
        , status
		    , ship_date
        , inord_no
        , created_by
        , create_date)
        VALUES 
        ( ?
        , ?
        , '0'
		,  STR_TO_DATE(?, '%Y-%m-%d')
		, ?
        , ?
        , NOW())
        `;

const insertshipdetail = `
INSERT INTO tb_ship_detail 
        ( ship_detail_no
		, ship_no
		, prod_lot_no
		, model_code
		, revision
        , ship_qty
        , created_by
        , create_date)
        VALUES 
        ( ?
        , ?
        , ?
        , ?
		    , ?
        , ?
	    	, ?
        , NOW())
        `;

const selectShip = `
  SELECT  MAS.CUST_NO
        , C.CUST_NAME
        , DET.MODEL_CODE
        , MM.MODEL_NAME
        , MM.REVISION
        , DET.SHIP_QTY
        , to_char(MAS.SHIP_DATE, 'YYYY-MM-DD') SHIP_DATE 
FROM	TB_SHIP_MASTER MAS JOIN TB_SHIP_DETAIL DET ON	MAS.SHIP_NO = DET.SHIP_NO
                           JOIN TB_MODEL_MASTER MM ON DET.MODEL_CODE = MM.MODEL_CODE
                           JOIN TB_CUST C		   ON MAS.CUST_NO = C.CUST_CODE
WHERE   ( ? IS NULL OR MAS.CUST_NO LIKE ? )
  AND   ( ? IS NULL OR MAS.SHIP_DATE = STR_TO_DATE(?, '%Y-%m-%d') )`;

module.exports = {
    shipmodel,
    lotnoscan,
    selectLastShipNo,
    insertshipmaster,
    insertshipdetail,
    selectShip,
};
