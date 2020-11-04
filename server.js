// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const figlet = require("figlet");
const sqlQueries = require("./lib/sql");

// Globals - list and list objects
let roleList;
let roleListObject;
let employeeList;
let employeeListObject;
let departmentList;
let departmentListObject;

// Connection to MySQL
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "j0rd@n12345",
  database: "employee_DB",
});

connection.connect(function (err) {
  if (err) throw err;
  // start();
  runApp();
});

// Agnostic functions to search IDs
    // findRoleId
function findRoleId(namedKey, objectArray) {
  for (var i = 0; i < objectArray.length; i++) {
    if (objectArray[i].title === namedKey) {
      return objectArray[i];
    }
  }
};

    // findEmployeeId
function findEmployeeId(namedKey, objectArray) {
  for (var i = 0; i < objectArray.length; i++) {
    if (objectArray[i].first_name + " " + objectArray[i].last_name === namedKey.toString()) {
      return objectArray[i].id;
    }
  }
};

    // findDepartmentId
function findDepartmentId(namedKey, objectArray) {
  for (var i = 0; i < objectArray.length; i++) {
    if (objectArray[i].name === namedKey) {
      return objectArray[i];
    }
  }
};

// Figlet Word art / top banner ( runApp() )
const runApp = () => {
  // Create "Welcome to the Label" ASCII with Figlet
  figlet("Welcome to\nthe Label", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    // Display the art along with a mini app description
    console.log(
      data +
        "\n\nEdit employee information within your record label\nto organize your business.\n" +
        "\nBegin:\n"
    );
    init();
  })
};

// Populate options list ( init() )
function init() {
  roleList = [];
  roleListObject = {};
  employeeList = [];
  employeeListObject = {};
  departmentList = [];
  departmentListObject = {};

    // Get Role IDS and titles
  connection.query(sqlQueries.utilGetRoleIdsTitles(), function (err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      roleList.push(results[i].title);
    }
    roleListObject = results;
  });

    // Get employee IDs and names
  connection.query(sqlQueries.utilGetEmployeeIdsNames(), function (err, results) {
    if (err) throw err;
    employeeList.push("None");
    for (let i = 0; i < results.length; i++) {
      employeeList.push(results[i].first_name + " " + results[i].last_name);
    }
    employeeListObject = results;
  });

    // Get Department IDs and names
  connection.query(sqlQueries.utilGetDepartmentIdsNames(), function (err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      departmentList.push(results[i].name);
    }
    departmentListObject = results;
  });

  start();
};

// Inquirer prompt
function start() {
  inquirer.prompt({
    name: "userAction",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View Employees",
      "View Employees by Manager",
      "View Employees by Department",
      "View Departments",
      "View Roles",
      new inquirer.Separator(),
      "Add Employee",
      "Add Department",
      "Add Role",
      new inquirer.Separator(),
      "Update Employee Role",
      "Update Employee Manager",
      new inquirer.Separator(),
      "Remove Employee",
      "Remove Department",
      "Remove Role",
      new inquirer.Separator(),
      "Exit",
      new inquirer.Separator(),
    ],
  })
  .then(function (answer) {
    if (answer.userAction === "View Employees") {
      viewEmployees();
    } else if (answer.userAction === "View Employees by Manager") {
      viewEmployeesByManager();
    } else if (answer.userAction === "View Employees by Department") {
      viewEmployeesByDepartment();
    } else if (answer.userAction === "View Departments") {
      viewDepartments();
    } else if (answer.userAction === "View Roles") {
      viewRoles();
    } else if (answer.userAction === "Add Employee") {
      addEmployee();
    } else if (answer.userAction === "Add Department") {
      addDepartment();
    } else if (answer.userAction === "Add Role") {
      addRole();
    } else if (answer.userAction === "Update Employee Role") {
      updateEmployeeRole();
    } else if (answer.userAction === "Update Employee Manager") {
      updateEmployeeManager();
    } else if (answer.userAction === "Remove Employee") {
      removeEmployee();
    } else if (answer.userAction === "Remove Department") {
      removeDepartment();
    }
  });
};

// Assign constructor functions to match inquirer options
function viewEmployees() {
  connection.query(sqlQueries.viewEmployees(), function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
};

function viewEmployeesByManager() {
  connection.query(sqlQueries.viewEmployeesByManager(), function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
};

function viewEmployeesByDepartment() {
  connection.query(sqlQueries.viewEmployeesByDepartment(), function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
};

function viewDepartments() {
  connection.query(sqlQueries.viewDepartments(), function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
};

function viewRoles() {
  connection.query(sqlQueries.viewRoles(), function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
};

function addEmployee() {
  inquirer.prompt([
    {
      message: "What is the employee's first name?",
      name: "newFirstName",
      validate: function validateFirstName(name) {
        return name !== "";
      },
      type: "input",
    },
    {
      message: "What is the employee's last name?",
      name: "newLastName",
      validate: function validateLastName(name) {
        return name !== "";
      },
      type: "input",
    },
    {
      message: "What is the employee's role?",
      name: "newRole",
      type: "list",
      choices: function () {
        var choiceArray = [];
        for (var key in roleListObject) {
          choiceArray.push(roleListObject[key].title);
        }
        return choiceArray;
      },
    },
    {
      message: "Who is the employee's manager?",
      name: "newManager",
      type: "list",
      choices: employeeList,
    },
  ])
  .then(function (answer) {
    var newRoleId = findRoleId(answer.newRole, roleListObject).id;
    var newManagerId = findEmployeeId(answer.newManager, employeeListObject)
      ? findEmployeeId(answer.newManager, employeeListObject)
      : null;

    connection.query(
      sqlQueries.addEmployee(
        answer.newFirstName,
        answer.newLastName,
        newRoleId,
        newManagerId
      ),
      function (err, results) {
        if (err) throw err;
        console.log("Added " + answer.newFirstName + " " + answer.newLastName + " to the database.");
        init();
      }
    );
  });
};

function addDepartment() {
  inquirer.prompt([
    {
      message: "What is the department name?",
      name: "newDepartmentName",
      validate: function validateFirstName(newDepartmentName) {
        return newDepartmentName !== "";
      },
      type: "input",
    },
  ])
  .then(function (answer) {
    connection.query(
      sqlQueries.addDepartment(answer.newDepartmentName),
      function (err, results) {
        if (err) throw err;
        console.log(answer.newDepartmentName + " added to the database.");
        init();
      }
    );
  });
};

function addRole() {
  inquirer.prompt([
    {
      message: "What is the title?",
      name: "newTitle",
      validate: function validateFirstName(newTitle) {
        return newTitle !== "";
      },
      type: "input",
    },
    {
      message: "What is the salary?",
      name: "newSalary",
      validate: function validateLastName(newSalary) {
        return newSalary !== "";
      },
      type: "input",
    },
    {
      message: "Select a department:",
      name: "newDepartment",
      type: "list",
      choices: function () {
        var choiceArray = [];
        for (var key in departmentListObject) {
          choiceArray.push(departmentListObject[key].name);
        }
        return choiceArray;
      },
    },
  ])
  .then (function (answer) {
    var newRoleId = findDepartmentId(answer.newDepartment, departmentListObject).id;
    connection.query(
      sqlQueries.addRole(
        answer.newTitle,
        answer.newSalary,
        newRoleId,
        newRoleId
      ),
      function (err, results) {
        if (err) throw err;
        console.log(answer.newTitle + " added to the database.");
        init();
      }
    );
  });
};

function updateEmployeeRole() {
  inquirer.prompt([
    {
      message: "Which employee do you want to update?",
      name: "selectedEmployee",
      type: "list",
      choices: employeeList,
    },
    {
      message: "Select their new role.",
      name: "selectedRole",
      type: "list",
      choices: roleList,
    },
  ])
  .then(function (answer) {
    var employeeIdToUpdate = findEmployeeId(
      answer.selectedEmployee,
      employeeListObject
    )
    ? findEmployeeId(answer.selectedEmployee, employeeListObject)
    : null;
    var newRoleId = findRoleId(answer.selectedRole, roleListObject).id;
    connection.query(
      sqlQueries.updateEmployeeRole(employeeIdToUpdate, newRoleId),
      function (err, results) {
        if (err) throw err;
        console.log("The role for " + answer.selectedEmployee + " has been changed to " + answer.selectedRole + ".");
        init();
      }
    );
  });
};

function updateEmployeeManager() {
  inquirer.prompt([
    {
      message: "Which employee do you want to update?",
      name: "selectedEmployee",
      type: "list",
      choices: employeeList,
    },
    {
      message: "Select their new manager.",
      name: "selectedManager",
      type: "list",
      choices: employeeList,
    },
  ])
  .then(function (answer) {
    var employeeIdToUpdate = findEmployeeId(
      answer.selectedEmployee,
      employeeListObject
    )
    ? findEmployeeId(answer.selectedEmployee, employeeListObject)
    : null;
    if (answer.selectedManager === answer.selectedEmployee) {
      newManagerId = null;
    } else if (findEmployeeId(answer.selectedManager, employeeListObject)) {
      newManagerId = findEmployeeId(answer.selectedManager, employeeListObject);
    } else {
      newManagerId = null;
    }
    connection.query(
      sqlQueries.updateEmployeeManager(newManagerId, employeeIdToUpdate),
      function (err, results) {
        if (err) throw err;
        console.log("The manager for " + answer.selectedEmployee + " has been changed to " + answer.selectedManager + ".");
        init();
      }
    );
  });
};

function removeEmployee() {
  inquirer.prompt({
    message: "Which employee do you want to remove?",
    name: "employeeName",
    type: "list",
    choices: employeeList,
  })
  .then(function (answer) {
    if (answer.employeeName === "None") {
      start();
    } else {
        var employeeIdToRemove = findEmployeeId(
          answer.employeeName,
          employeeListObject
        )
        ? findEmployeeId(answer.employeeName, employeeListObject)
        : null;
        connection.query(
          sqlQueries.removeEmployee(employeeIdToRemove),
          function (err, results) {
            if (err) throw err;
            console.log(answer.employeeName + " removed from the database.");
            init();
          }
        );
    }
  });
};

function removeDepartment() {
  inquirer.prompt([
    {
      message: "Which department do you want to remove?",
      name: "removeDepartment",
      type: "list",
      choices: departmentList,
    },
  ])
  .then(function (answer) {
    console.log(answer.removeDepartment);
    var removeDepartmentId = findDepartmentId(
      answer.removeDepartment,
      departmentListObject
    ).id;
    console.log(removeDepartmentId);
    connection.query(
      sqlQueries.removeDepartment(removeDepartmentId),
      function (err, results) {
        if (err) throw err;
        console.log(answer.removeDepartment + " was removed from the database.");
        init();
      }
    );
  });
};

// Call functions