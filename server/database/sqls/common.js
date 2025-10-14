//
const selectCommonInfo = `
SELECT group_code,
      common_code,
      code_name
FROM tb_code
ORDER BY group_code
`;

// 공통코드 select
const selectCommon = `
SELECT group_code code,
       code_name name
FROM tb_code
`;

//코드그룹 select

module.exports = {
  selectCommonInfo,
  selectCommon,
};
