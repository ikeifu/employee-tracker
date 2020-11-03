// SQL Query Functions

const utilGetRoleIdsTitles = () => {
    return `SELECT r.id, r.title
            FROM role r
            ORDER BY r.title ASC;`;
};