// 공통코드 그룹 목록 조회
const selectCommon = `
SELECT group_code code,
       group_name name
FROM tb_code_group
ORDER BY group_code
`;

//특정 코드그룹 내 코드목록 조회
const selectCommonInfo = `
SELECT g.group_code groupCode,
      c.common_code commonCode,
      c.code_name codeName
FROM tb_code c
JOIN tb_code_group g
  ON c.group_code = g.group_code
WHERE g.group_code LIKE ?
ORDER BY c.common_code
`;

//등록
const insertCommon = `
INSERT INTO tb_code
(common_code,
group_code,
code_name)
VALUES
(?,
?,
?)
ON DUPLICATE KEY UPDATE
common_code = VALUES(common_code),
group_code = VALUES(group_code),
code_name = VALUES(code_name)
`;
module.exports = {
  selectCommonInfo,
  selectCommon,
  insertCommon,
};
