const mysql = require('mysql2');
const inquirer = require('inquirer');
const { default: Choices } = require('inquirer/lib/objects/choices');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Missbean7!',
    database: 'company_db'
});


console.log(`
    _____  ____   __  __  _____          _   _ __     __    
  / ____|/ __ \\ |  \\/  ||  __ \\  /\\    | \\ | |\\ \\   / /    
 | |    | |  | || \\  / || |__) |/  \\   |  \\| | \\ \\_/ /     
 | |    | |  | || |\\/| ||  ___// /\\ \\  | . \` |  \\   /      
 | |____| |__| || |  | || |   / ____ \\ | |\\  |   | |       
  \\_____|\\____/ |_| _|_||_|  /_/    \\_\\|_| \\_|___|_|_____  
 |  \\/  |    /\\    | \\ | |    /\\    / ____||  ____||  __ \\ 
 | \\  / |   /  \\   |  \\| |   /  \\  | |  __ | |__   | |__) |
 | |\\/| |  / /\\ \\  | . \` |  / /\\ \\ | | |_ ||  __|  |  _  / 
 | |  | | / ____ \\ | |\\  | / ____ \\| |__| || |____ | | \\ \\ 
 |_|  |_|/_/    \\_\\|_| \\_|/_/    \\_\\_____||______||_|  \\_\\

 `)

connection.connect((err) => {
    if (err) throw err;
    console.log('connected to database')
    menu();
});

function menu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'How would you like to proceed',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Update Employee Role',
                'Add Role',
                'Add Employee',
                'Add Department',
                'Exit'
            ]
        }
    ])
        .then(answer => {
            switch (answer.options) {
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Exit':
                    console.log('Goodbye!');
                    connection.end();
                    break;
                default:
                    console.log('Invalid choice');
                    menu();
            }
        });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.error('Error retrieving departments:', err);
            menu();
            return;
        }

        console.table(results);
        menu();
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            console.error('Error retrieving roles:', err);
            menu();
            return;
        }

        console.table(results);
        menu();
    });
}

function viewAllEmployees() {
    const query = `
      SELECT
        e.id AS Employee_ID,
        e.first_name AS First_Name,
        e.last_name AS Last_Name,
        r.title AS Role,
        r.salary AS Salary,
        CONCAT(m.first_name, ' ', m.last_name) AS Manager_Name
      FROM employee e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN employee m ON e.manager_id = m.id;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving employees:', err);
            menu();
            return;
        }

        console.table(results);
        menu();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName', // Use the correct column name here
            message: 'Enter the name of the new department:',
            validate: departmentName => departmentName ? true : "Name cannot be empty."
        }
    ]).then(answer => {
        connection.query('INSERT INTO department SET ?', { department_name: answer.departmentName }, (err) => { // Use the correct column name here
            if (err) throw err;
            console.log('Department added successfully.');
            // Return to main menu or exit
            menu();
        });
    });
}

function addEmployee() {
    connection.query('SELECT id, title FROM roles', (err, res) => {
        if (err) throw err;

        const roles = res.map(role => ({ name: role.title, value: role.id }));

        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the first name of the new employee:',
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the last name of the new employee:',
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'Select the role of the new employee:',
                    choices: roles,
                },
                {
                    name: 'manager_id',
                    type: 'input',
                    message: 'Enter the appropriate manager ID number for the new employee:',
                },
            ])
            .then((answers) => {
                connection.query('INSERT INTO employee SET ?', {
                    first_name: answers.first_name,
                    last_name: answers.last_name,
                    role_id: answers.role,
                    manager_id: answers.manager_id,
                }, (err, res) => {
                    if (err) throw err;
                    console.log(`\n ${answers.first_name} ${answers.last_name} successfully added to the database! \n`);
                    employees(); // You should define the employees() function to display the updated list of employees.
                });
            });
    });
}

function addRole() {
    // Query to retrieve department names and their IDs
    const departmentQuery = 'SELECT id, department_name FROM department';

    connection.query(departmentQuery, (err, departmentResults) => {
        if (err) {
            console.error('Error retrieving departments:', err);
            menu();
            return;
        }

        const departmentChoices = departmentResults.map(department => ({
            name: department.department_name,
            value: department.id,
        }));

        inquirer
            .prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'Enter the title of the new role:',
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the salary for the new role:',
                },
                {
                    name: 'department_id',
                    type: 'list',
                    message: 'Select the department for the new role:',
                    choices: departmentChoices,
                },
            ])
            .then((answers) => {
                const newRole = {
                    title: answers.title,
                    salary: parseFloat(answers.salary),
                    department_id: answers.department_id,
                };

                connection.query('INSERT INTO roles SET ?', newRole, (err, res) => {
                    if (err) {
                        console.error('Error adding the new role:', err);
                    } else {
                        console.log(`\n ${answers.title} role successfully added to the database! \n`);
                    }
                    menu();
                });
            });
    });
}

function updateRole() {
    // Query to retrieve roles
    const query_role = 'SELECT id, title FROM roles';

    // Query to retrieve employees
    const query_employee = 'SELECT id, first_name, last_name FROM employee';

    connection.query(query_role, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({ name: role.title, value: role.id }));

        connection.query(query_employee, (err, res) => {
            if (err) throw err;
            let employeeList = res.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));

            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'rawlist',
                    message: 'Select the employee you would like to update:',
                    choices: employeeList,
                },
                {
                    name: 'newRole',
                    type: 'rawlist',
                    message: 'Select new role:',
                    choices: roles,
                },
            ]).then((answers) => {
                connection.query('UPDATE employee SET ? WHERE ?', [
                    {
                        role_id: answers.newRole,
                    },
                    {
                        id: answers.employee,
                    },
                ], (err, res) => {
                    if (err) throw err;
                    console.log(`\n Successfully updated employee's role in the database! \n`);
                    menu();
                });
            });
        });
    });
}