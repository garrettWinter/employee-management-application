//NPM modules
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// perform 1 more round of Testing and remove if all works correctly.
// let byDepartmentList = [];
// let roleList = [];
// let employeeList = [];

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ema_db'
    },
    console.log(`Connection established with the ema_db database.`)
);

//Main Menu Options and if logic to route selections to the appropriate function
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
                    'View department budget utilization',
                    "Add a new Department",
                    "Add a new Role",
                    "Add an Employee",
                    "Update an Employees Title and Manager",
                    "Delete a Department, Role, or Employee",
                    "Quit Employee Management Application"]
            }
        ])
        .then((response) => {
            if (response.mainMenuChoice === 'View all departments') {
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

            if (response.mainMenuChoice === 'Delete a Department, Role, or Employee') {
                deleteMenu();
            }

            if (response.mainMenuChoice === 'Quit Employee Management Application') {
                console.log("Closing Employee Management Application")
                process.exit(0);
            }

            if (response.mainMenuChoice === 'View department budget utilization') {
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

            if (response.mainMenuChoice === 'Add an Employee') {
                createEmployee();
            }

            if (response.mainMenuChoice === "Update an Employees Title and Manager") {
                updateEmployeeList();
            }
        })
};

// This runs a query to obtain a list of departments to be used in the viewEmployeesByDepartment report.
function setDepartmentList() {
    db.query(`
    SELECT department_name
    FROM departments 
    ORDER BY department_name ASC`, (err, results) => {
        if (err) {
            console.log(err);
        }
        byDepartmentList = [];
        for (let i = 0; i < results.length; i++) {
            byDepartmentList.push(results[i].department_name);
        }
        byDepartmentMenu(byDepartmentList);
    })
};

// This runs a query to obtain a list of Employees to which the user can select from to be able to change the manager and title of that employee.
function updateEmployeeList() {
    employeeList = [];
    db.query(`
    SELECT CONCAT (employees.first_name, ' ', employees.last_name, ' /  ', roles.title, ' / ', employees.employee_ID) AS 'employee_Details'
    FROM employees
    JOIN roles ON roles.role_ID = employees.role_ID
    WHERE active_employee = true
    ORDER BY employees.first_name ASC;`, (err, results) => {
        if (err) {
            console.log(err);
        }
        for (let i = 0; i < results.length; i++) {
            employeeList.push(results[i].employee_Details);
        }
        updateRoleList();
    })
};

// This runs a query to obtain a list of roles to which the user can select to be able to change the title of a selected employee.
function updateRoleList() {
    db.query(`
    SELECT title
    FROM roles 
    ORDER BY title ASC;`, (err, results) => {
        if (err) {
            console.log(err);
        }
         for ( let i = 0; i < results.length; i++) {
            roleList.push(results[i].title);
        }
        updateEmployee();
    })
};

// This function prompts the user with a list of departments, and they can select one to see a list of employees that are a part of that department.
function byDepartmentMenu(byDepartmentList) {
     inquirer
        .prompt([
            {
                type: 'list',
                message: 'Please select a department that would you like to see the employees of:',
                name: 'employeeDepartment',
                default: (0),
                choices: byDepartmentList
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

// This function creates an array of employees that have people that report to them.
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

//This function allows the user to select a manager from a list, and then see a list of employees that report to them.
function byManagerMenu(managerList) {
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

//This function is used to allow a user to be able to create a new department.
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
            db.query(`
            INSERT INTO departments (department_name, department_budget)
            VALUES (?, ?);`, [response.newDepartmentName, response.newDepartmentBudget], (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("Department has been created");
                mainMenu();
            })
        })
};

//This function is used to allow a user to be able to create a new role.
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
              db.query(`INSERT INTO roles (title, salary, department_id)
                VALUES (?, ?, ?);`, [response.newRoleTitle, response.newRoleSalary, response.newRoleDepartmentId], (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("Role has been created");
                mainMenu();
            })
        })
};

//This function is used to allow a user to be able to create a new employee in the system.
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
                message: 'Please enter the role_id for the position that the new employee will be performing.',
                name: 'newEmployeeRoleId',
            },
            {
                type: 'input',
                message: 'Please enter the emplooyee_id of the Manager that will be overseeing this new hire.',
                name: 'newEmployeeManagerId',
            }
        ])
        .then((response) => {
            db.query(`
                INSERT INTO employees (first_name, last_name, role_id, manager_emp_id)
                VALUES (?, ?, ?, ?);`, [response.newEmployeeFirstName, response.newEmployeeLastName, response.newEmployeeRoleId, response.newEmployeeManagerId], (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("New employee " + response.newEmployeeFirstName + " " + response.newEmployeeLastName + " has been created.");
                mainMenu();
            })
        })
};

//This function is used to allow a user to be able to update a existing employees title and manager.
function updateEmployee(){
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'Which Employee needs to be updated?',
            name: 'updateEmployeeId',
            default: (0),
            choices: employeeList
        },
        {
            type: 'list',
            message: 'Please choose the new Title this employee has:',
            name: 'updateEmployeeTitle',
            default: (0),
            choices: roleList
        },
        {
            type: 'list',
            message: 'Please choose the new Manager for this employee:',
            name: 'updateEmployeeManagerId',
            default: (0),
            choices: employeeList
        }
    ])
    .then((response) => {
        let empID = response.updateEmployeeId.split('/');
        let managerID = response.updateEmployeeManagerId.split('/');
        console.log(empID[2]);

        db.query(`
        UPDATE employees
        SET role_id = (SELECT role_ID FROM roles WHERE title = ? ),
            manager_emp_id = ?
        WHERE employee_ID = ?;`
                , [response.updateEmployeeTitle, managerID[2], empID[2]], (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log("Record has been updated");
            mainMenu();
        })
    })
}

// This created a sub-menu of delete options.
function deleteMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Would you',
                name: 'deleteMenuChoice',
                default: (0),
                choices: [
                        "Delete a Department",
                        "Delete a Role",
                        "Delete a Employee"]
            },
        ])
        .then((response) => {
            if (response.deleteMenuChoice === 'Delete a Department') {
                deleteDepartmentList();
            }
            if (response.deleteMenuChoice === 'Delete a Role') {
                deleteRoleList();
            }
            if (response.deleteMenuChoice === 'Delete a Employee') {
                deleteEmployeeList();
            }
        })
};

// This generates an array of departments which will be used as part of the corelating delete function.
function deleteDepartmentList() {
    db.query(`
    SELECT CONCAT (department_name, ' / ', department_id) as 'department_details'
    FROM departments 
    ORDER BY department_name ASC;`, (err, results) => {
        if (err) {
            console.log(err);
        }
        deleteDepartmentChoices = [];
        for (let i = 0; i < results.length; i++) {
            deleteDepartmentChoices.push(results[i].department_details);
        }
        deleteDepartment(deleteDepartmentChoices);
    })
};

// This function will handing the deletion of a department record.
function deleteDepartment(deleteDepartmentChoices){
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'Which Department would you like to delete?',
            name: 'deleteDepartmentChoice',
            default: (0),
            choices: deleteDepartmentChoices
        }
    ])
    .then((response) => {
        let delDepartment = response.deleteDepartmentChoice.split('/');
        console.log(delDepartment[1]);

        db.query(`
        DELETE FROM departments
        WHERE department_id = ?;`
                , delDepartment[1], (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log("Department has been deleted");
            mainMenu();
        })
    })
}

// This generates a aaray of roles which will be used as part of the corelating delete function.
function deleteRoleList() {
    db.query(`
    SELECT CONCAT (title, ' / ', role_id) as 'role_details'
    FROM roles 
    ORDER BY title ASC;`, (err, results) => {
        if (err) {
            console.log(err);
        }
        deleteRoleChoices = [];
        for (let i = 0; i < results.length; i++) {
            deleteRoleChoices.push(results[i].role_details);
        }
        deleteRole(deleteRoleChoices);
    })
};

// This function will be handing the deletion of a role record.
function deleteRole(deleteRoleChoices){
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'Which Role would you like to delete?',
            name: 'deleteDepartmentChoice',
            default: (0),
            choices: deleteRoleChoices
        }
    ])
    .then((response) => {
        let delRole = response.deleteDepartmentChoice.split('/');
        console.log(delRole[1]);

        db.query(`
        DELETE FROM roles
        WHERE role_id = ?;`
                , delRole[1], (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log("Role has been deleted");
            mainMenu();
        })
    })
}

// This generates an array of employees which will be used as part of the corelating delete function.
function deleteEmployeeList() {
    db.query(`
    SELECT CONCAT (employees.first_name, ' ', employees.last_name, ' /  ', roles.title, ' / ', employees.employee_ID) AS 'employee_Details'
    FROM employees
    JOIN roles ON roles.role_ID = employees.role_ID
    WHERE active_employee = true
    ORDER BY employees.first_name ASC;`, (err, results) => {
        if (err) {
            console.log(err);
        }
        deleteEmployeeChoices = [];
        for (let i = 0; i < results.length; i++) {
            deleteEmployeeChoices.push(results[i].employee_Details);
        }
        deleteEmployee(deleteEmployeeChoices);
    })
};

// This function will be handing the deletion of a employee record.
function deleteEmployee(deleteEmployeeChoices){
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'Which Employee would you like to delete?',
            name: 'deleteEmployeeChoice',
            default: (0),
            choices: deleteEmployeeChoices
        }
    ])
    .then((response) => {
        let delEmployee = response.deleteEmployeeChoice.split('/');
        console.log(delEmployee[2]);

        db.query(`
        DELETE FROM employees
        WHERE employee_id = ?;`
                , delEmployee[2], (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log("Employee has been deleted");
            mainMenu();
        })
    })
}

module.exports = mainMenu;