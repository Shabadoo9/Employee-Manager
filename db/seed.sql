INSERT INTO department (department_name)
VALUES ('Sales'), ('Collections'), ('Shop');

INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Manager', 100000, 1),
       ('Salesperson', 75000, 1),
       ('Collections Manager', 120000, 2),
       ('Collections Agent', 80000, 2),
       ('Shop Manager', 80000, 3),
       ('Technician', 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('john', 'doe', 1, NULL),
       ('Ashley', 'Jones', 3, NULL),
       ('Duke', 'jones', 5, NULL),
       ('Kyle', 'long', 2, 1), -- Kyle reports to John
       ('Lewis', 'Brown', 4, 3), -- Lewis reports to Ashley
       ('John', 'Browning', 6, 5); -- John reports to Duke
