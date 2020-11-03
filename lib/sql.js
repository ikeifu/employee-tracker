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