const searchProdPlan = `
SELECT 
  DATE_FORMAT(p.create_date, '%Y-%m-%d') AS regPlanDate,
  DATE_FORMAT(p.start_date, '%Y-%m-%d') AS startPlanDate,
  DATE_FORMAT(p.end_date, '%Y-%m-%d') AS endPlanDate,
  p.model_code AS modelCode,
  p.revision,
  p.proc_code AS procCode,
  c.code_name AS procName,
  m.model_name AS modelName,
  m.unit,
  p.plan_qty AS planQty
FROM tb_prod_plan p
JOIN tb_code c 
  ON p.proc_code = c.common_code AND c.group_code = 'proc'
JOIN tb_model_master m 
  ON p.model_code = m.model_code AND p.revision = m.revision
WHERE (
        (p.start_date BETWEEN ? AND ?)      -- 1,2
     OR (p.end_date BETWEEN ? AND ?)        -- 3,4
     OR (p.start_date <= ? AND p.end_date >= ?) -- 5,6
      )
  AND p.model_code LIKE ?   -- 7
  AND p.revision LIKE ?     -- 8
  AND p.proc_code LIKE ?    -- 9
ORDER BY p.end_date
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
WHERE prod_plan_no LIKE ?
ORDER BY prod_plan_no DESC
LIMIT 1
`;

// 수주량 합계
const sumQty = `
SELECT p.model_code AS modelCode,
       p.revision,
       p.proc_code AS procCode,
       c.code_name AS procName,
       ord.inord_qty AS totalInordQty,
       sd.ship_qty AS totalShipQty
FROM tb_prod_plan p
JOIN tb_code c
  ON p.proc_code = c.common_code
 AND c.group_code = 'proc'
LEFT JOIN (select sum(inord_qty) inord_qty, model_code, revision from tb_inord_detail ord group by model_code, revision) ord
       ON (p.model_code = ord.model_code
      AND p.revision = ord.revision)
LEFT JOIN (select sum(ship_qty) ship_qty, model_code, revision from tb_ship_detail sd group by model_code, revision) sd
       ON (p.model_code = sd.model_code
      AND p.revision = sd.revision)
WHERE p.model_code LIKE ?
  AND p.revision LIKE ?
`;

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
