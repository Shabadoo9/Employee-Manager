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
    inquirer.prompt([{
        type: 'list',
        name: 'options',
        message: 'How would you like to proceed',
        Choices: [
            'View all departments',
            'View all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee',
            'exit',
        ]
    }
    ])
 }