//대메뉴조회
const selectBmenu = `
SELECT b_menu_code,
b_menu_name
FROM tb_b_menu
`;

//소메뉴조회
const selectSmenu = `
SELECT s.s_menu_code,
s.s_menu_name,
s.program_name,
b.B_MENU_NAME
FROM tb_s_menu s
JOIN tb_b_menu b
ON s.b_menu_code = b.b_menu_code
WHERE b.b_menu_code = ?
`;

//
module.exports = {
  selectBmenu,
  selectSmenu,
};
