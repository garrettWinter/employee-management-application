const apiRoles = require('express').Router();
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


// GET Route for Roles
apiRoles.get('/', (req, res) => {
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
        res.json(result);
      });
}
);

module.exports = apiRoles;