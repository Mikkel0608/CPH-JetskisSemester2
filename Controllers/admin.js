//Importing the database connection
const pool = require('../Models/db');

//Function that sends a response with all users where the usertype is a customer-type.
//Joining tables users and usertype, so only customer-users are retrieved.
function getUser(req, res){
    if (req.session.adminloggedin === true){
        pool.query(`SELECT u.userid, ut.type, u.username, u.streetname, u.streetnumber, u.postalcode, u.city, u.phone, u.email, u.created_at
                    FROM users u JOIN usertype ut
                    ON u.usertypeid = ut.usertypeid 
                    WHERE ut.type = $1 AND userid = $2;`, ['cus', req.params.userid]).then(result => {
                        res.send(result.rows[0]);
        });
    }
}


function getUsers(req, res) {
    if (req.session.adminloggedin === true) {
        var type = 'cus';
        pool.query(`SELECT u.userid, ut.type, u.username, u.streetname, u.streetnumber, u.postalcode, u.city, u.phone, u.email, u.created_at
                    FROM users u JOIN usertype ut
                    ON u.usertypeid = ut.usertypeid 
                    WHERE ut.type = $1;`, [type]).then(result => {
            res.send(result.rows);
        })
    }
}

//Function that sends a response with all orders by a specific customer using a route parameter.
function getOrdersByUser(req, res){
    if (req.session.adminloggedin === true) {
        pool.query(`SELECT orderid, orderday, ordermonth, orderyear, timeperiod, orderprice, order_placed_at
                FROM orders WHERE userid = $1;`,
            [req.params.userid]).then(result => {
            res.send(result.rows);
        })
    }
}

//Function that sends a response with an orderid from a specific order using a route parameter
function getOrder(req, res){
    if (req.session.adminloggedin === true) {
        pool.query(`SELECT orderid
                FROM orders WHERE orderid = $1;`,
            [req.params.orderid]).then(result => {
            res.send(result.rows);
        })
    }
}

//Function that sends a response with all orders based on a sorting criteria from the client.
//Type of sorting is determined by the route parameter. The route parameter is used to make a string containing
//the table to order the query by.
var table = '';
function allOrders (req, res){
    var sorting = parseInt(req.params.sorting);
        //console.log(typeof parseInt(req.params.sorting));
        if (sorting === 1 || 2 || 3) {
            if (sorting === 1) {
                table = 'userid ASC';
            } else if (sorting === 2) {
                table = 'orderid ASC';
            } else if (sorting === 3) {
                table = 'orderprice DESC';
            }

//Querying the database for the orders as well as the orderproducts.
//Products property is created to store an array of orderproducts.
//Response is sent when the loop has looped through all elements in the array.
            if (req.session.adminloggedin === true) {
                pool.query(`SELECT * from orders ORDER BY ${table}`,
                ).then(result => {
                    var orders = result.rows;
                    for (let i = 0; i < orders.length; i++) {
                        orders[i].products = [];

                        pool.query(`select count(op.productid), p.modelname, op.productid, p.price
                    from orderproduct as op JOIN products as p
                    on op.productid = p.productid 
                    where orderid = $1
                    group by p.modelname, op.productid, p.price
                    order by op.productid;`, [orders[i].orderid]).then(result1 => {

                            var products = result1.rows;
                            for (let x = 0; x < products.length; x++) {
                                orders[i].products.push(products[x]);
                            }
                            if (i === orders.length-1) {
                                res.send(orders);
                                console.log(orders);
                            }
                        });
                    }
                })
            }
        }
}

module.exports = {
    getUsers,
    getOrdersByUser,
    getOrder,
    allOrders,
    getUser
};


