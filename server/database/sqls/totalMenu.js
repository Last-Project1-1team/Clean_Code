//대메뉴조회
const selectBmenu = `
SELECT b_menu_code bMenuCode,
b_menu_name bMenuName
FROM tb_b_menu
`;

//소메뉴조회
const selectSmenu = `
SELECT s.s_menu_code sMenuCode,
s.s_menu_name sMenuName,
s.program_name programName,
b.B_MENU_NAME bMenuName
FROM tb_s_menu s 
JOIN tb_b_menu b
ON s.b_menu_code = b.b_menu_code 
WHERE b.b_menu_code = ?
`;

//대메뉴등록
const insertBmenu = `
INSERT INTO tb_b_menu
(b_menu_code,
b_menu_name)
VALUES
(?,
?);
`;

//소메뉴등록
const insertSmenu = `
INSERT INTO tb_s_menu 
(b_menu_code, 
s_menu_code, 
s_menu_name, 
program_name)
VALUES 
(?, 
?, 
?, 
?);
`;
//
module.exports = {
  selectBmenu,
  selectSmenu,
  insertBmenu,
  insertSmenu,
};
