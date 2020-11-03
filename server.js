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
  });
  .then(function (answer) {
    if (answer.userAction === "View Employees") {
      viewEmployees();
    } else if (answer.userAction === "View Employees by Manager") {
      viewEmployeesByManager();
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
  connection.query(sqlQueries.viewEmployeesByManager(), function (
    err,
    results
  ) {
    if (err) throw err;
    console.table(results);
    start();
  });
};

// Call functions