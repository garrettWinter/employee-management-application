const inquirer = require('inquirer');

const mysql = require('mysql2');
const cTable = require('console.table');
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

// let managerList;

function setManagerList() {
    db.query(`
    SELECT CONCAT (employees.first_name, ' ', employees.last_name, ' /  ', roles.title, ' / ', employees.employee_ID) AS 'manager_Details'
    FROM employees
    JOIN roles ON roles.role_ID = employees.role_ID
    WHERE employees.employee_ID IN (select employees.manager_emp_ID from employees) and active_employee = true
    ORDER BY employees.first_name ASC;`, (err, results) => {
        if (err) {
            console.log(err);
        }
        managerList = [];
        for (let i = 0; i < results.length; i++) {
            managerList.push(results[i].manager_Details);
        }
        byManagerMenu(managerList);
    })
};


async function byManagerMenu(managerList) {
    //creating an array of active managers for inquirer prompt
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Please select a manager (Name / Title / Emp #) that would you like to see the employees of:',
                name: 'employeeManager',
                default: (0),
                choices: managerList
            }
        ])
        .then((response) => {


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
        WHERE emp1.manager_emp_id = (
                SELECT employees.employee_ID
                FROM employees
                join roles ON roles.role_ID = employees.role_ID
                where CONCAT (employees.first_name, ' ', employees.last_name, ' /  ', roles.title, ' / ', employees.employee_ID) = ?
                )
        ORDER BY emp1.first_name ASC;`,response.employeeManager, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.table(result);
                mainMenu();
            })
        }
        )
}




function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'mainMenuChoice',
                default: (0),
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'View all employees by manager',
                    'View all employees by department',
                    'View department budget utiliazation',
                    "Add a new department",
                    "Add a role",
                    "add an employee",
                    "Update an employee role",
                    "Quit Employee Management Application"]
            }
        ])
        .then((response) => {
            if (response.mainMenuChoice === 'View all departments') {
                console.log()
                db.query(`
                SELECT
                    department_id as "Department ID",
                    department_name as "Department Name",
                    FORMAT (department_budget,'c', 'en-US') AS "Department Budget ($)",
                    date_created as "Date Created",
                    last_updated as "Updated On"
                FROM departments;`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(result);
                    mainMenu();
                })
            };

            if (response.mainMenuChoice === 'View all roles') {
                console.log()
                db.query(`
            SELECT
                roles.title AS "Title",
                roles.role_id AS "Role ID",
                department_name AS "Department Name",
                roles.department_id AS "Department ID",
                FORMAT (roles.salary,'c', 'en-US') AS "Salary ($)",
                roles.date_created AS "Date Role Created",
                roles.last_updated AS "Role Last Updated"
            FROM roles
            JOIN departments ON departments.department_id = roles.department_id;`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(result);
                    mainMenu();
                })
            };

            if (response.mainMenuChoice === 'View all employees') {
                console.log()
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
                ORDER BY emp1.employee_id ASC;`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(result);
                    mainMenu();
                })
            };

            if (response.mainMenuChoice === 'View all employees by manager') {
                setManagerList();
            }
            ;

            if (response.mainMenuChoice === 'CHOICE') {
                console.log()
                db.query(`QUERY`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(result);
                    mainMenu();
                })
            };

            if (response.mainMenuChoice === 'CHOICE') {
                console.log()
                db.query(`QUERY`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(result);
                    mainMenu();
                })
            };



        });
};

module.exports = mainMenu;