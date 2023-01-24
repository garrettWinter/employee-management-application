const inqurier = require('inquirer');

function mainMenu () {
    inquirer
        .list([
            {
                type:'list',
                message:'What would you like to do?',
                name: 'mainMenuChoice',
                default:(0),
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
console.log(mainMenuChoice);
        });
};