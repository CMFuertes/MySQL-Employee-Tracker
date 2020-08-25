var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Belle!123",
    database: "etracker_db"
  });

  // connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    startApp();
  });

  //intial prompt and switch cases, depending on selection
  function startApp () {
      inquirer
      .prompt({
          name: "selection",
          type: "list",
          message: "What would you like to do today?",
          choices: [
              "View All Employees",
              "View All Departments",
              "View All Roles",
              "Add an Employee",
              "Add a Department",
              "Add a Role", 
              "Update an Employee Role",
              "Exit"
          ],
      }).then(function (answer){

          switch (answer.selection) {
              case "View All Employees":
                  viewEmployees();
                  break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "View All Roles":
                    viewRoles ();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Update an Employee Role":
                    updateRole();
                    break;
                case "Exit":
                    exit();
                    break;
          }
      })
  }


  //functions


  function viewEmployees() {
  	var query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
    if (err) throw err;
    console.log(`You are viewing ${res.length} employees`);
    console.table("All Employees:", res); 
    startApp();
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.log(`You are viewing ${res.length} departments`);
    console.table("All Departments:", res); 
    startApp();
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.log(`You are viewing ${res.length} roles`);
    console.table("All Roles:", res); 
    startApp();
    })
}

  function addEmployee () {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
            },
            {
            name: "last_name",
            type: "input", 
            message: "What is the employee's last name?"
            },
            {
            name: "role",
            type: "list",
            choices: function() {
                var roleArray = [];
                for (var i = 0; i < res.length; i++) {
                    roleArray.push(res[i].title);
                }
                return roleArray;
            },
            message: "What is the employee's role?"
            },
        ])
        .then(function (answer) {
            var roleID;
            for (var i = 0; i < res.length; i++) {
                if (res[i].title == answer.role) {
                    roleID = res[i].id;
                    console.log(roleID)
                }
            }
            connection.query(
                "INSERT INTO employee SET ?", 
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: roleID, 
                },
                function (err) {
                    if (err) throw err;
                    console.log("New Employee has been added.");
                    startApp();
                }
            )
        })
    })
  }

  function addDepartment () {
    inquirer.prompt([
        {
            name: "new_dept",
            type: "input",
            message: "What is the name of the new department?"
        }
    ])
    .then(function (answer) {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answer.new_dept
            }
        );
        var query = "SELECT * FROM department";
        connection.query(query, function(err, res) {
            if(err)throw err;
            console.table("All Departments:", res);
            startApp();
        })
    })
  }

  function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;

        inquirer.prompt ([
            {
                name: "new_role",
                type: "input",
                message: "What is the name of this new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "How much is the salary of this position?"
                
            },
            {
                name: "deptChoice",
                type: "list",
                message: "Which deparment does this role belong to?",
                choices: function() {
                    var deptArray = [];
                    for (var i = 0; i < res.length; i++){
                        deptArray.push(res[i].name);
                    }

                    return deptArray;
                    
                    
                },
            }
        ])
        .then(function (answer) {
            console.log(answer, 'ANSWER')
            var deptID;
            for (var i = 0; i < res.length; i++) {
                if (res[i].name == answer.deptChoice) {
                    deptID = res[i].id;
                }
            }
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: deptID
                },
                function (err, res) {
                    if(err)throw err;
                    console.log("Your new role has been added.");
                    startApp();
                }
            )
         })
    })
}

function updateRole (){
    var roleQuery = "SELECT * FROM role;";
    var departmentQuery = "SELECT * FROM department;";
    
    connection.query(roleQuery, function (err, role) {
        if (err) throw err;
    connection.query(departmentQuery, function (err, department){
        if (err) throw err;
        inquirer.prompt([
            {
                name: "new_role",
                type: "rawlist", 
                choices: function () {
                    var roleArray = [];
                    for (var i = 0; i < role.length; i++){
                        roleArray.push(role[i].title);
                    }
                    return roleArray;
                },
                message: "Choose a role you wish to update"
            },
            {
                name: "new_salary",
                type: "input",
                message: "What is the new salary?"
            },
            {
                name: "department",
                type: "rawlist",
                choices: function() {
                    var deptArray = [];
                    for (var i = 0; i < department.length; i++){
                        deptArray.push(department[i].name);
                    }
                    return deptArray;
                },
                message: "Which department does this role belong to?"
            },
        ]).then (function (result) {
            var roleID = 0;
            for (var i = 0; i < role.length; i++) {
                if (role[i].title === result.new_role) {
                    roleID = role[i].id;
                }
            }
            connection.query("UPDATE role SET title=?,salary= ? WHERE id= ?", [
                result.new_role,
                result.new_salary,
                roleID
            ], function (err) {
                if (err) throw err;
                console.table("Role Successfuly Updated!");
                startApp()
            });
        })
    })
})
}

function exit() {
    connection.end();
  }