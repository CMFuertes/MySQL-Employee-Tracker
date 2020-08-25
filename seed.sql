INSERT INTO department (name)
VALUES ("Sales"), ("Human Resources"), ("Finance"), ("Legal"), ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 120000, 1),
        ("Salesperson", 75000, 1),
        ("HR Manager", 99000, 2),
        ("Company Recruiter", 52000, 2),
        ("Accountant", 130000, 3),
        ("Lawyer", 200000, 4),
        ("Legal Team Lead", 240000, 4),
        ("Software Engineer", 140000, 5),
        ("Head Engineer", 150000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Victoria", "Perez", 1, 1), 
        ("Alex", "Johnson", 2, null),
        ("Rebecca", "Cruz", 3, 2),
        ("Joseph", "Dominguez", 4, null),
        ("Eden", "Ventura", 5, 3),
        ("Brian", "Fitzgerald", 6, null),
        ("Andrea", "Addams", 7, 5),
        ("Brandon", "Mejias", 8, null),
        ("Kelly", "Dender", 9, 4);
        
