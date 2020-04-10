//Importing the database connection
const pool = require('./Models/db');
//Importing the express server
const app = require('./index.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

function adminMW (req, res, next){
    if (req.session.adminloggedin === true){
        pool.query(`SELECT userid, username, streetname, streetnumber, postalcode, 
                    city, phone, email, created_at FROM users WHERE userid = $1;`,
            [req.session.userid]).then(result =>{
            req.user = result.rows[0];
            next();
        });
    } else {
        req.user = JSON.stringify(0);
        next();
    }
}
function admInfo (req, res){
    res.json(req.user)
}

module.exports = {
    adminMW,
    admInfo
};