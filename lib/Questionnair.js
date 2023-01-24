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
                })};

                if (response.mainMenuChoice === 'View all departments') {
                    console.log()
                    db.query(`QUER`, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        console.table(result);
                        mainMenu();
                    })};


        });
};

module.exports = mainMenu;