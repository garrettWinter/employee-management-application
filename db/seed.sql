USE ema_db;

INSERT INTO departments (department_name, department_budget)
VALUES ("Customer Service", 250000),
("Accounting", 400000),
("Marketing", 500000),
("Development", 450000),
("Client Management", 400000),
("Human Resources", 300000),
("C Suit", 1000000);

INSERT INTO roles (title, salary, department_id)
VALUES ("CSR", 40000, 1),
("CS Manager", 55000, 1),
("Accountant", 90000, 2),
("Accouting Manager", 120000, 2),
("Marketing Manager", 90000, 3),
("Marketing Director", 120000, 3),
("QA Analyst", 55000, 4),
("Software Developer", 90000, 4),
("Manager of Engineering", 120000, 4),
("Client Manager", 85000, 5),
("Director of Client Management", 150000, 5),
("HR Analyst", 65000, 6),
("HR Director", 125000, 6),
("CEO", 1000000, 7);

INSERT INTO employees (first_name, last_name, role_id, manager_emp_id)
VALUES ("Rico", "Navarro", 1, 2),
("Jennie", "Wall", 1, 2),
("Louisa", "Stein", 2, 23),
("Callan", "Jackson", 3, 6),
("Mae", "Rice", 3, 6),
("Frankie", "Mayo", 4, 23),
("Kaan", "Ayala", 5, 10),
("Brendan", "Blevins", 5, 10),
("Alina", "Norton", 5, 10),
("Aliza", "Byrd", 6, 23),
("Mariyah", "Smith", 7, 16),
("Zuzanna", "Jefferson", 7, 16),
("Issac", "Randall", 7, 16),
("Miriam", "Connor", 8, 16),
("Bernice", "Hoffman", 8, 16),
("Jed", "Marsh", 9, 23),
("Yasmin", "Salazar", 10, 19),
("Ronan", "Dickerson", 10, 19),
("Calvin", "Roy", 11, 23),
("Lori", "Holden", 12, 22),
("Brooke", "Beltran", 12, 22),
("Elisabeth", "Bowman", 13, 23),
("Connie", "Decker", 14, 0);