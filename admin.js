//Importing the database connection
const pool = require('./Models/db');
//Importing the express server
const app = require('./index.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getUsersMW(req, res, next) {
    if (req.session.adminloggedin === true) {
        var type = 'cus';
        pool.query(`SELECT u.userid, ut.type, u.username, u.streetname, u.streetnumber, u.postalcode, u.city, u.phone, u.email, u.created_at
                    FROM users u JOIN usertype ut
                    ON u.usertypeid = ut.usertypeid 
                    WHERE ut.type = $1;`, [type]).then(result => {
            req.allUsers = result.rows;
            next();
        })
    } else {
        req.allUsers = JSON.stringify(0);
        next();
    }
}

function getUsers(req, res){
    res.json(req.allUsers);
}

function getOrder(req, res){
    if (req.session.adminloggedin === true) {
        pool.query(`SELECT orderid, orderday, ordermonth, orderyear, timeperiod, orderprice, order_placed_at
                FROM orders WHERE userid = $1;`,
            [req.params.id]).then(result => {
            res.send(result.rows);
        })
    }
}

module.exports = {
    getUsersMW,
    getUsers,
    getOrder
};


