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
        let managerList = [];
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
        ORDER BY emp1.first_name ASC;`, response.employeeManager, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.table(result);
                mainMenu();
            })
        })
};

function setDepartmentList() {
    db.query(`
    SELECT department_name
    FROM departments 
    ORDER BY department_name ASC`, (err, results) => {
        if (err) {
            console.log(err);
        }
        let departmentList = [];
        for (let i = 0; i < results.length; i++) {
            departmentList.push(results[i].department_name);
        }
        byDepartmentMenu(departmentList);
    })
};


function byDepartmentMenu(departmentList) {
    //creating an array of active managers for inquirer prompt
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Please select a department that would you like to see the employees of:',
                name: 'employeeDepartment',
                default: (0),
                choices: departmentList
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
        WHERE departments.department_name = ?
        ORDER BY emp1.first_name ASC;`, response.employeeDepartment, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.table(result);
                mainMenu();
            })
        })
};

function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'mainMenuChoice',
                default: (6),
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'View all employees by manager',
                    'View all employees by department',
                    'View department budget utiliazation',
                    "Add a new Department",
                    "Add a new Role",
                    "Add an Employee",
                    "Update an employee title",
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

            if (response.mainMenuChoice === 'View all employees by department') {
                setDepartmentList();
            }

            if (response.mainMenuChoice === 'View department budget utiliazation') {
                console.log()
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
                    mainMenu();
                })
            }

            if (response.mainMenuChoice === 'Add a new Department') {
                createDepartment();
            }

            if (response.mainMenuChoice === 'Add a new Role') {
                createRole();
            }

            if (response.mainMenuChoice === 'add an Employee') {
                createEmployee();
            }
        })
};

function createDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Please enter the name of the New Department',
                name: 'newDepartmentName',
            },
            {
                type: 'input',
                message: 'Please enter the budget of the New Department',
                name: 'newDepartmentBudget',
            }
        ])
        .then((response) => {
            console.log(response.newDepartmentName);
            console.log(response.newDepartmentBudget);
            
            db.query(`
            INSERT INTO departments (department_name, department_budget)
            VALUES (?, ?);`, [response.newDepartmentName, response.newDepartmentBudget], (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.table(result);
                mainMenu();
            })
        })
};

function createRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Please enter the title of the New Role',
                name: 'newRoleTitle',
            },
            {
                type: 'input',
                message: 'Please enter the salary of the New role',
                name: 'newRoleSalary',
            },
            {
                type: 'input',
                message: 'Please enter the department_id that this New role belongs to:',
                name: 'newRoleDepartmentId',
            }
        ])
        .then((response) => {
            console.log(response.newRoleTitle);
            console.log(response.newRoleSalary);
            console.log(response.newRoleDepartmentId);
            db.query(`INSERT INTO roles (title, salary, department_id)
                VALUES (?, ?, ?);`, [response.newRoleTitle, response.newRoleSalary, response.newRoleDepartmentId], (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.table(result);
                mainMenu();
            })
        })
};

function createEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Please enter the First Name of the New Employee',
                name: 'newEmployeeFirstName',
            },
            {
                type: 'input',
                message: 'Please enter the Last Name of the New Employee',
                name: 'newEmployeeLastName',
            },
            {
                type: 'input',
                message: 'Please enter the role_id for the position that the new empolyee will be performing.',
                name: 'newEmployeeRoleId',
            },
            {
                type: 'input',
                message: 'Please enter the emplooyee_id of the Manager that will be overseeing this new hire.',
                name: 'newEmployeeManagerId',
            }
        ])
        .then((response) => {
            console.log(response.newEmployeeFirstName);
            console.log(response.newEmployeeLastName);
            console.log(response.newEmployeeRoleId);
            console.log(response.newEmployeeManagerId);
            db.query(`
                INSERT INTO employees (first_name, last_name, role_id, manager_emp_id)
                VALUES (?, ?, ?, ?);`, [response.newEmployeeFirstName, response.newEmployeeLastName, response.newEmployeeRoleId, response.newEmployeeManagerId], (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.table(result);
                mainMenu();
            })
        })
};

module.exports = mainMenu;