USE ema_db;

-- -- SELECT employees.employee_id AS "Employee ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", departments.department_name AS "Department",
-- -- roles.title AS "Title", roles.salary AS "Salary", employees.manager_emp_id,
-- -- employees.date_created AS "Employee Create Date", employees.last_updated AS "Employee Last Updated"
-- select *
-- FROM employees A
-- -- JOIN roles ON roles.role_id = A.employees.role_id
-- -- JOIN departments ON departments.department_id = roles.department_id
-- LEFT JOIN employees B ON B.employee_id = A.manager_emp_id
-- ORDER BY A.employees.employee_id ASC;


SELECT 
    A.employee.first_name,
    A.employee.last_name,
    B.employee.first_name,
    B.employee.last_name
FROM
    employees
    LEFT JOIN employees A ON A.employees.manager_emp_id = employees.employee_id
    LEFT JOIN employees B ON B.employees.employee_id =  employees.employee_id;