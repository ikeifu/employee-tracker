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
    // Get Role IDS and titles

    // Get employee IDs and names

    // Get Department IDs and names
};

// Inquirer prompt

// Assign constructor functions to match inquirer options

// Call functions