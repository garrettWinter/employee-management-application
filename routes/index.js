const express = require('express');

const reportsRouter = require('./reports.js');

const app = express();

//Defining route paths
app.use('/reports', reportsRouter);
// Departments
// Employees
// Roles


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

module.exports = app;