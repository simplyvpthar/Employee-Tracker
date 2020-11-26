use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('HR');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Joe', 'Doe', 1, NULL),
    ('Hugh', 'Jacobson', 2, 1),
    ('Janette', 'Robeson', 3, NULL),
    ('Larry', 'Hughes', 4, 3),
    ('Kevin', 'Smith', 5, NULL),
    ('Anna', 'Brown', 6, 5),
    ('Billy', 'Newsome', 7, NULL),
    ('Jake', 'Smithson', 8, 7);
