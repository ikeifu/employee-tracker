// SQL Query Functions

const utilGetRoleIdsTitles = () => {
    return `SELECT r.id, r.title
            FROM role r
            ORDER BY r.title ASC;`;
};

const utilGetEmployeeIdsNames = () => {
    return `SELECT e.id, e.first_name, e.last_name
            FROM employee e
            ORDER BY e.first_name ASC;`;
};

const utilGetDepartmentIdsNames = () => {
    return `SELECT d.id, d.name
            FROM department d
            ORDER BY d.name ASC;`;
};

const viewEmployees = () => {
    return `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', d.name AS 'Department', r.title AS 'Title', r.salary AS 'Salary', CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
            FROM employee e
                LEFT JOIN employee m ON m.id = e.manager_id
                LEFT JOIN Role r ON e.role_id = r.id
                LEFT JOIN Department d ON d.id = r.department_id
            ORDER BY e.id ASC;`;
};

const viewEmployeesByManager = () => {
    return `SELECT IFNULL(CONCAT(m.first_name, ' ', m.last_name), '-self-') AS 'Manager', CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', d.name, r.title, d.name, r.salary
            FROM employee e
                LEFT JOIN employee m ON m.id = e.manager_id
                JOIN Role r ON e.role_id = r.id
                JOIN Department d ON d.id = r.department_id
            ORDER BY m.first_name ASC;`;
};

const viewEmployeesByDepartment = () => {
    return `SELECT d.name AS 'Department', CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', r.title, d.name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
            FROM employee e
                LEFT JOIN employee m ON m.id = e.manager_id
                JOIN Role r ON e.role_id = r.id
                JOIN Department d ON d.id = r.department_id
            ORDER BY d.name;`;
};

const viewDepartments = () => {
    return `SELECT name AS 'Department Name'
            FROM department
            ORDER BY name ASC;`;
};

// Exports

exports.utilGetEmployeeIdsNames = utilGetEmployeeIdsNames;
exports.utilGetRoleIdsTitles = utilGetRoleIdsTitles;
exports.utilGetDepartmentIdsNames = utilGetDepartmentIdsNames;

exports.viewEmployees = viewEmployees;
exports.viewEmployeesByManager = viewEmployeesByManager;
exports.viewEmployeesByDepartment = viewEmployeesByDepartment;
exports.viewDepartments = viewDepartments;