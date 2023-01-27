const apiRoles = require('express').Router();
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ema_db'
    },
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