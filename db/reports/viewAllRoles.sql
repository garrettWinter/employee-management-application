USE ema_db;

SELECT
    roles.title AS "Title",
    roles.role_id AS "Role ID",
    department_name AS "Department Name",
    roles.department_id AS "Department ID",
    FORMAT (roles.salary,'c', 'en-US') AS "Salary ($)",
    roles.date_created AS "Date Role Created",
    roles.last_updated AS "Role Last Updated"
FROM roles
JOIN departments ON departments.department_id = roles.department_id;