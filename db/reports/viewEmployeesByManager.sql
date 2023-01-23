USE ema_db;

SELECT
    emp1.employee_id AS 'Employee ID',
    emp1.first_name AS 'First Name', emp1.last_name AS 'Last Name',
    departments.department_name AS 'Department',
    roles.title AS 'Title',
    FORMAT (roles.salary,'c', 'en-US') AS "Salary ($)",
    emp2.first_name AS 'Managers First Name', emp2.last_name as 'Managers Last Name',
    emp1.manager_emp_id as 'Manager ID',
    emp1.date_created AS 'Employee Create Date',
    emp1.last_updated AS 'Employee Last Updated'
FROM employees as emp1
JOIN roles ON roles.role_id = emp1.role_id
JOIN departments ON departments.department_id = roles.department_id
LEFT JOIN employees as emp2 ON emp1.manager_emp_id = emp2.employee_id
-- WHERE emp1.manager_emp_id = ? -- THIS SHOULD BE fed in via a parameter
WHERE emp1.manager_emp_id = 1
ORDER BY emp1.first_name ASC;