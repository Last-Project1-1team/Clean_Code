const shipmodel = `
SELECT    C.cust_name
        , DET.MODEL_CODE
        , DET.REVISION
FROM	TB_INORD_MASTER MAS JOIN TB_INORD_DETAIL DET ON	 MAS.INORD_NO = DET.INORD_NO
						            	JOIN TB_CUST C 			      ON	 MAS.cust_code = C.cust_code
WHERE 	MAS.INORD_NO ?`;

module.exports = { shipmodel };
