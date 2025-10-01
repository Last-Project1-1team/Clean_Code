# Clean_Code

211.188.49.138


const apiUrl = import.meta.env.VITE_API_BASE_URL;

fetch(`${apiUrl}/users`)
.then(res => res.json())
.then(data => console.log(data));

// 이렇게 사용



SELECT DISTINCT LVL, LOW_CODE, LOW_REVISION, NEED_QTY, PATH
FROM V_BOM_LIST
WHERE MODEL_CODE = 'B00002'
ORDER BY PATH;

SELECT * FROM V_BOM_LIST A 
LEFT OUTER JOIN V_ITEM_MASTER B 
ON A.LOW_CODE = B.ITEM_CODE 
WHERE MODEL_CODE = 'M00001'
 ORDER BY PATH;
