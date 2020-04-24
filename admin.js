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

function getOrdersByUser(req, res){
    if (req.session.adminloggedin === true) {
        pool.query(`SELECT orderid, orderday, ordermonth, orderyear, timeperiod, orderprice, order_placed_at
                FROM orders WHERE userid = $1;`,
            [req.params.userid]).then(result => {
            res.send(result.rows);
        })
    }
}

function getOrder(req, res){
    if (req.session.adminloggedin === true) {
        pool.query(`SELECT orderid, orderday, ordermonth, orderyear, timeperiod, orderprice, order_placed_at
                FROM orders WHERE orderid = $1;`,
            [req.params.orderid]).then(result => {
            res.send(result.rows);
        })
    }
}

var table = '';
function allOrders (req, res){
        console.log(req.params);
        if (req.params.sorting === '1' || '2' || '3') {
            if (req.params.sorting === '1') {
                table = 'userid ASC';
            } else if (req.params.sorting === '2') {
                table = 'orderid ASC';
            } else if (req.params.sorting === '3') {
                table = 'orderprice DESC';
            }
            console.log(table);


            if (req.session.adminloggedin === true) {
                pool.query(`SELECT * from orders ORDER BY ${table}`,
                ).then(result => {
                    var orders = result.rows;
                    //console.log(orders);
                    for (let i = 0; i < orders.length; i++) {
                        orders[i].products = [];
                        pool.query(`select count(op.productid), p.modelname, op.productid, p.price
                    from orderproduct as op JOIN products as p
                    on op.productid = p.productid 
                    where orderid = $1
                    group by p.modelname, op.productid, p.price
                    order by op.productid;`, [orders[i].orderid]).then(result1 => {
                            var products = result1.rows;
                            //console.log(products.length);
                            for (let x = 0; x < products.length; x++) {
                                orders[i].products.push(products[x]);
                            }
                            if (i === orders.length-1) {
                                res.send(orders);
                                console.log(orders);
                            }
                            //console.log(orders[0].products[0]);

                        });
                        //res.send(orders);
                    }
                })
            }
        }
}

module.exports = {
    getUsersMW,
    getUsers,
    getOrdersByUser,
    getOrder,
    allOrders
};


