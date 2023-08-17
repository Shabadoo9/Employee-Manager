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
                updateEmployeeRole();
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
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) {
            console.error('Error retrieving employees:', err);
            menu();
            return;
        }
        
        console.table(results);
        menu();
    });
}