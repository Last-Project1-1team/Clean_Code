const selectAccountInfo =
  //전체조회
  `SELECT 
          user_id userId
        , password
        , name
        , work_grade workGrade
        , department
        , phone
        , email
        , hire_date hireDate
        , retire_yn retireYn
        , retire_date retireDate
    FROM tb_user
    WHERE user_id LIKE ?
      AND name LIKE ?
      AND department LIKE ?
      AND work_grade LIKE ?
    ORDER BY user_id`;

    // 
const searchDepartment = 
  `SELECT common_code code,
          code_name name
  FROM tb_code
  WHERE group_code = 'department'`;
const searchWorkGrade = 
  `SELECT common_code code,
          code_name name
  FROM tb_code
  WHERE group_code = 'work_grade'`;
  


    module.exports = {
      selectAccountInfo,

    }
