const apiDepartments = require('express').Router();
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ema_db'
  },
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