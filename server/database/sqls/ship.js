const shipmodel = `
SELECT    C.cust_name
		, DET.MODEL_CODE
		, DET.REVISION
FROM	TB_INORD_MASTER MAS JOIN TB_INORD_DETAIL DET ON	 MAS.INORD_NO = DET.INORD_NO
							JOIN TB_CUST C 			 ON	 MAS.cust_code = C.cust_code
WHERE 	MAS.INORD_NO = ?`;

const lotnoscan = `
SELECT 	L.MODEL_CODE
		, M.MODEL_NAME
        , M.REVISION
FROM	TB_PROD_LOT L JOIN TB_MODEL_MASTER M 
						ON L.MODEL_CODE = M.MODEL_CODE
WHERE	PROD_LOT_NO = 'PLOT25101600001`;

const modelinfo = `
SELECT 	MODEL_NAME
		, SPEC
        , UNIT
FROM	TB_MODEL_MASTER
WHERE	MODEL_CODE IN (?);
`;

module.exports = { shipmodel, lotnoscan, modelinfo };
