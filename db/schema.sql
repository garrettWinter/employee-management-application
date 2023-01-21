DROP DATABASE IF EXISTS ema_db;
CREATE DATABASE ema_db;

USE ema_db;

CREATE TABLE departments (
department_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
department_name VARCHAR(30) NOT NULL,
department_budget INT NOT NULL,
date_created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
last_updated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE roles (
role_id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL NOT NULL,
department_id INT,
date_created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
last_updated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
FOREIGN KEY (department_id)
REFERENCES departments(department_id)
ON DELETE SET NULL
);

CREATE TABLE employees (
employee_id INT PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager_emp_id INT,
active_employee BOOLEAN DEFAULT true NOT NULL,
date_created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
last_updated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
FOREIGN KEY (role_id)
REFERENCES roles(role_id)
ON DELETE SET NULL,
FOREIGN KEY (manager_emp_id)
REFERENCES employees(employee_id)
ON DELETE SET NULL
);


