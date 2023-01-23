const reports = require('express').Router();
const path = require('path'); // Did you use this?
const mysql = require('mysql2');
const fs = require('fs'); // Did you use this?

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password
      password: '',
      database: 'ema_db'
    },
    console.log(`Connected to the ema_db database.`)
  );


// GET Route for viewEmployeesByDepartment
reports.get('/viewEmployeesByDepartment', (req, res) => {
    db.query(`
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
ORDER BY departments.department_name ASC;`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        res.json(result);
      });
}
);



reports.get('/viewEmployeesByDepartment/:department_id', (req, res) => {
    db.query(`
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
WHERE departments.department_id = ?
ORDER BY departments.department_name ASC;`,req.params.department_id, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        res.json(result);      
      });
}
);



// GET Route for viewEmployeesByManager
reports.get('/viewEmployeesByManager', (req, res) => {
    db.query(`
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
ORDER BY emp2.first_name ASC;`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        res.json(result);
      });
}
);



reports.get('/viewEmployeesByManager/:manager_emp_id', (req, res) => {
    db.query(`
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
WHERE emp1.manager_emp_id = ?
ORDER BY emp1.first_name ASC;`,req.params.manager_emp_id, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        res.json(result);      
      });
}
);


// GET Route for viewUtilizedBudget
reports.get('/viewUtilizedBudget', (req, res) => {
    db.query(`
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
GROUP BY departments.department_id;`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        res.json(result);
      });
}
);


module.exports = reports;