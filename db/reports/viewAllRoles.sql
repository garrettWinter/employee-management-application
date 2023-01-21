USE ema_db;

SELECT roles.title AS "Title", roles.role_id AS "Role ID", department_name AS "Department Name", roles.department_id AS "Department ID", roles.salary AS "Salary", roles.date_created AS "Date Role Created", roles.last_updated AS "Role Last Updated"
FROM roles
JOIN departments ON departments.department_id = roles.department_id;

---- Still need to JOIN this with the departments table to get the department Name

