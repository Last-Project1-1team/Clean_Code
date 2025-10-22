//제품정보
// const selectProdInfo = `
// SELECT m.model_code modelCode,
//           m.revision,
//         m.model_name modelName,
//         m.model_flag modelFlag,
//        c1.code_name modelFlagName
// FROM tb_model_master m
// JOIN tb_code c1
//   ON (m.model_flag = c1.common_code
//  AND c1.group_code = 'model_flag')
// WHERE m.model_code LIKE ?
//   AND m.revision LIKE ?
//   AND m.model_name LIKE ?
// `;

//공정정보
const selectProcRouting = `
SELECT pr.proc_seq procSeq,
       pr.proc_code procCode,
       c.code_name codeName
FROM tb_model_master m
JOIN tb_proc_routing pr
  ON (m.model_code = pr.model_code
 AND m.revision = pr.revision)
JOIN tb_code c
  ON (pr.proc_code = c.common_code)
WHERE pr.model_code = ?
  AND pr.revision = ?    
`; 
