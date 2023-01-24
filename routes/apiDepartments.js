const apiDepartments = require('express').Router();
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


// GET Route for Departments
apiDepartments.get('/', (req, res) => {
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
        res.json(result);
      });
}
);

module.exports = apiDepartments;