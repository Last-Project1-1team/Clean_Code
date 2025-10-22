const searchProdPlan = `
SELECT DATE_FORMAT(p.create_date, '%Y-%m-%d') regPlanDate,
       DATE_FORMAT(p.start_date, '%Y-%m-%d') startPlanDate,
       DATE_FORMAT(p.end_date, '%Y-%m-%d') endPlanDate,
       p.model_code modelCode,
       p.revision,
       p.proc_code procCode,
       c.code_name procName,
       m.model_name modelName,
       m.unit,
       p.plan_qty planQty
FROM tb_prod_plan p
JOIN tb_code c ON (p.proc_code = c.common_code AND c.group_code = 'proc')
JOIN tb_model_master m ON (p.model_code = m.model_code AND p.revision = m.revision)
WHERE DATE_FORMAT(p.create_date, '%Y-%m-%d') LIKE ?
  AND p.start_date <= ?  
  AND p.end_date >= ? 
  AND p.model_code LIKE ?
  AND p.revision LIKE ?
  AND p.proc_code LIKE ?
  AND p.start_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
 `;

// 공정 select
const selectProc = `
SELECT common_code code,
       code_name name
FROM tb_code
WHERE group_code = 'proc'
  AND common_code = '0G05'
`;
// 생산계획번호 조회용 쿼리
const selectLastProdPlanNo = `
SELECT prod_plan_no
  FROM tb_prod_plan
 ORDER BY prod_plan_no DESC
 LIMIT 1
`;

// 수주량 합계
const sumQty = `
SELECT 
    p.model_code AS modelCode,
    p.revision,
    p.proc_code AS procCode,
    c.code_name AS procName,
    SUM(ord.inord_qty) AS totalInordQty,
    SUM(sd.ship_qty) AS totalShipQty
FROM tb_prod_plan p
JOIN tb_code c
    ON p.proc_code = c.common_code
   AND c.group_code = 'proc'
LEFT JOIN tb_inord_detail ord
    ON p.model_code = ord.model_code
   AND p.revision = ord.revision
LEFT JOIN tb_ship_detail sd
    ON p.model_code = sd.model_code
   AND p.revision = sd.revision
WHERE p.create_date LIKE ?
  AND p.start_date LIKE ?
  AND p.end_date LIKE ?
  AND p.model_code LIKE ?
  AND p.revision LIKE ?
  AND p.proc_code LIKE ?
GROUP BY p.model_code, p.revision, p.proc_code
`;
// SELECT
//         p.model_code modelCode,
//         p.revision,
//         p.proc_code procCode,
//         c.code_name procName,
//         SUM(ord.inord_qty) AS totalInordQty
// FROM tb_prod_plan p
// JOIN tb_code c
//   ON (p.proc_code = c.common_code
//  AND c.group_code = 'proc')
// LEFT JOIN tb_inord_detail ord
//   ON (p.model_code = ord.model_code
//  AND p.revision = ord.revision)
// WHERE p.create_date LIKE ?
//  AND p.start_date LIKE ?
//  AND p.end_date LIKE ?
//  AND p.model_code LIKE ?
//  AND p.revision LIKE ?
//  AND p.proc_code LIKE ?
// GROUP BY p.model_code, p.revision, p.proc_code, c.code_name
// `;

const insertProdPlan = `
INSERT INTO tb_prod_plan
(prod_plan_no,
create_date,
start_date,
end_date,
plan_qty,
model_code,
revision,
proc_code)
VALUES
(?,
?,
?,
?,
?,
?,
?,
?)
`;

module.exports = {
  searchProdPlan,
  selectProc,
  sumQty,
  insertProdPlan,
  selectLastProdPlanNo,
};
