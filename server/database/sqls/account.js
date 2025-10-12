const selectAccountInfo = `
SELECT u.user_id userId, 
          u.password, 
          u.name,
          u.work_grade workGrade,
          c1.code_name workGradeName,
          u.department,
          c2.code_name deptName,
          u.phone, 
          u.email, 
          TO_CHAR(u.hire_date, 'YYYY-MM-DD') hireDate, 
          u.retire_yn retireYn, 
          TO_CHAR(u.retire_date, 'YYYY-MM-DD') retireDate
FROM tb_user u
JOIN tb_code c1
  ON (u.work_grade = c1.common_code
 AND c1.group_code = 'GRADE')
JOIN tb_code c2
  ON (u.department = c2.common_code
 AND c2.group_code = 'DEPT')
WHERE LOWER(u.user_id) LIKE LOWER(?)
  AND LOWER(u.name) LIKE LOWER(?)
`;
//AND c1.work_grade LIKE ? 
//AND c2.department LIKE ?
//`;

    // 
const selectDepartment = 
  `SELECT common_code code,
          code_name name
  FROM tb_code
  WHERE group_code = 'DEPT'`;
const selectWorkGrade = 
  `SELECT common_code code,
          code_name name
  FROM tb_code
  WHERE group_code = 'GRADE'`;

  // 등록
const insertUser = `
INSERT INTO tb_user
(user_id,
password,
name,
work_grade,
department,
phone,
email,
hire_date,
retire_yn,
retire_date)
VALUES
(?,
?,
?,
?,
?,
?,
?,
?,
?,
?)
ON DUPLICATE KEY UPDATE
user_id = VALUES(user_id),
password = VALUES(password),
name = VALUES(name),
work_grade = VALUES(work_grade),
department = VALUES(department),
phone = VALUES(phone),
email = VALUES(email),
hire_date = VALUES(hire_date),
retire_yn = VALUES(retire_yn),
retire_date = VALUES(retire_date)
`;
  
    module.exports = {
      selectAccountInfo,
      selectDepartment,
      selectWorkGrade,
      insertUser,
    };
