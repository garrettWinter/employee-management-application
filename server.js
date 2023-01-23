const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');


const routes = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json()); //This is required so that express middleware can use json data.
app.use(express.urlencoded({ extended: true })); // This will have the middleware update special chars to encoded values
app.use(express.static('public'));

/* Establishing the Database Connetion*/
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

//   db.query(`SELECT * FROM departments WHERE department_id = ?`,1, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
//   });



app.use('/', routes);

app.listen(PORT, () => console.log(`Application listening http://localhost:${PORT}`));
