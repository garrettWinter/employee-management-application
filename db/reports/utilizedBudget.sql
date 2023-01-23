USE ema_db;

SELECT 
	departments.department_name AS 'Department',
	departments.department_ID AS 'Department ID',
    FORMAT (departments.department_budget,'c', 'en-US') AS 'Allocated Budget ($)',
    FORMAT ((SUM(roles.salary)),'c', 'en-US') AS 'Utilized Budget ($)',
    FORMAT ((departments.department_budget - SUM(roles.salary)),'c', 'en-US') AS 'Budget Variance ($)',
    departments.date_created as "Date Created",
    departments.last_updated as "Updated On"

FROM employees as emp1
JOIN roles ON roles.role_id = emp1.role_id
JOIN departments ON departments.department_id = roles.department_id
LEFT JOIN employees as emp2 ON emp1.manager_emp_id = emp2.employee_id
GROUP BY departments.department_id;