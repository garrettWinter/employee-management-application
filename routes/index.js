const express = require('express');

const reportsRouter = require('./reports.js');
const apiDepartmentsRouter = require('./apiDepartments.js');
const apiEmployeesRouter = require('./apiEmployees.js');
const apiRolesRouter = require('./apiRoles.js');


const app = express();

//Defining route paths
app.use('/reports', reportsRouter);
app.use('/api/departments', apiDepartmentsRouter);
app.use('/api/employees', apiEmployeesRouter);
app.use('/api/roles', apiRolesRouter);


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

module.exports = app;