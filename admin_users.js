//Importing the database connection
const pool = require('./Models/db');
//Importing the express server
const app = require('./index.js');


function getUsers(req, res){
    pool.query(`SELECT userid, usertypeid, username, streetname, streetnumber, 
                postalcode, city, phone, email, created_at 
                FROM users;`,
        ).then(result =>{
            res.json(result.rows);
    })
}

module.exports = {
    getUsers
};
