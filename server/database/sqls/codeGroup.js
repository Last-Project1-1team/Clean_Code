// 공통코드 그룹 목록 조회(셀렉트박스)
const selectGroup = `
SELECT group_code code,
       group_name name
FROM tb_code_group
ORDER BY group_code
`;

//특정 코드그룹 내 코드목록 조회(조회)
const selectGroupInfo = `
SELECT group_code groupCode,
	     group_name groupName,
       group_desc groupExp
FROM tb_code_group
WHERE group_code LIKE ?
`;

//등록(저장)
const insertGroup = `
INSERT INTO tb_code_group
(group_code,
group_name,
group_desc)
VALUES
(?,
?,
?)
ON DUPLICATE KEY UPDATE
group_code = VALUES(group_code),
group_name = VALUES(group_name),
group_desc = VALUES(group_desc)
`;
module.exports = {
  selectGroup,
  selectGroupInfo,
  insertGroup,
};
