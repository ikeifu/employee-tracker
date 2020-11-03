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