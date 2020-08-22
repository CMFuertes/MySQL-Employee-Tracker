var mysql = require("mysql");
var inquirer = require("inquirer");

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
  const startApp = () => {
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
          switch (answer.selections) {
              case "View All Employees":
                  viewEmployees();
                  break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "Add an Employee",
                    addEmployee():
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Update an Employee Role",
                    updateRole():
                    break;
                case "Exit":
                    connection.end();
                    break;
          }
      })
  }


  //functions


//   function viewEmployees(){
//       console.log("You are viewing employees! oh wow!");
//   }

  function addEmployee () {
    //   console.log("adding an employee");
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
