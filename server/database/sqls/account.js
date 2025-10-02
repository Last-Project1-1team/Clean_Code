const selectAccountList =
  //
  `SELECT 
          user_id
        , password
        , name
        , work_grade
        , department
        , phone
        , email
        , hire_date
        , retire_yn
        , retire_date
    FROM tb_user
    ORDER BY user_id`;
