//Importing the database connection
const pool = require('../Models/db');
const registerFunction = require('./registerControllers');

//This function deletes the active user by using the userid from the url parameter in the query
//Because of the ON DELETE CASCADE constraint on the usertypeid FK, the corresponding row in the users table will
//be deleted as well.
function deleteUser(request, response){
        var usertypeid = null;
        const activeEmail = request.session.email;
        console.log(activeEmail);
        pool.query(`SELECT usertypeid FROM users WHERE userid = $1;`, [request.params.userid]).then(results => {
        usertypeid = results.rows[0].usertypeid;
        console.log(usertypeid);

        pool.query(`DELETE FROM usertype WHERE usertypeid = $1`, [usertypeid]);
        console.log(`Bruger med e-mail ${activeEmail} er blevet slettet.`);
        request.session.email = undefined;
        request.session.userid = undefined;
        request.session.loggedin = undefined;
        response.send(JSON.stringify('ok'));
            }
        )
}

//Function that deletes a specific order from the active user.
//Uses the url parameter to delete a specific order
function deleteOrder (req, res){
    pool.query(`DELETE FROM orders WHERE orderid = $1 AND userid = $2`,
    [req.params.orderid, req.session.userid]);
    res.send(JSON.stringify('ok'));
}

//Function that updates the password of the active user.
//Uses the randomChar function that returns a random lowercase letter (a pepper) and adds it to the password
//Uses the crypt() function from the pgcrypto PostgreSQL extension to add a salt and hash the password
function updatePassword(req, res){
        console.log(req.body);
        req.body.password += registerFunction.randomChar(1);
        pool.query(`UPDATE users SET password = crypt($1, gen_salt('bf')) WHERE userid = $2 `,
            [req.body.password, req.params.userid]).then(results => {
                console.log(results.rows);
                res.send(JSON.stringify('ok'));
            });
}

//Sends a response with user info for the active user
function showInfo (req, res){
    pool.query(`SELECT userid, username, streetname, streetnumber, postalcode, 
                    city, phone, email, created_at FROM users WHERE userid = $1;`,
        [req.session.userid]).then(result =>{
        res.send(result.rows[0]);
    });
}

//Sends a response with all order Ids for the active user
function showOrder (req, res){
    pool.query(`SELECT orderid FROM orders WHERE userid = $1;`,
        [req.session.userid]).then(result =>{
        res.send(result.rows);
    });
}

//Function that sends a response with an order and the products in the order
//Creates a product array on the order object to store products
//The sql count() function is used to count the quantity of rows in the orderproduct table with identical productid's
//Joining several tables in order to make sure that the user can only get their own information
//Admin has access to all orders
function ordersByOrderId (req, res) {
    if (req.session.loggedin === true) {
        pool.query(`SELECT orderid, userid, orderday, ordermonth, orderyear, timeperiod, orderprice, order_placed_at
                    FROM orders WHERE orderid = $1 AND userid =$2;`,
            [req.params.orderid, req.session.userid]).then(result => {
            var order = result.rows[0];
            order.products = [];
            pool.query(`select count(op.productid), p.modelname, op.productid, p.price
                    from orderproduct as op 
                    JOIN products as p
                    on op.productid = p.productid
                    JOIN orders as o
                    on o.orderid = op.orderid
                    JOIN users as u 
                    on u.userid = o.userid
                    where o.orderid = $1 AND u.userid = $2
                    group by p.modelname, op.productid, p.price
                    order by op.productid;`, [req.params.orderid, req.session.userid])
                .then(result => {

                console.log(result.rows);
                var products = result.rows;
                pushProducts(products, order);
                res.send(order);
            });
        });
    } else if (req.session.adminloggedin === true){
        pool.query(`SELECT orderid, userid, orderday, ordermonth, orderyear, timeperiod, orderprice, order_placed_at
                    FROM orders WHERE orderid = $1`,
            [req.params.orderid]).then(result => {
            var order = result.rows[0];
            order.products = [];
            pool.query(`select count(op.productid), p.modelname, op.productid, p.price
                    from orderproduct as op JOIN products as p
                    on op.productid = p.productid 
                    where orderid = $1
                    group by p.modelname, op.productid, p.price
                    order by op.productid;`, [req.params.orderid])
                .then(result => {

                console.log(result.rows);
                var products = result.rows;
                pushProducts(products, order);
                res.send(order);
            });
        });
    }
    function pushProducts(products, order){
        products.forEach((item) => {
            order.products.push(item);
        });
    }
}

//First if-statement: Making sure that the customer only can access their own data from orderproducts table,
//hence the 4-table join.
//Second if-statement is for the admin: Admin should be able to access any data from orderproducts table.
/*
function orderProduct (req, res){
    if (req.session.loggedin === true){
        pool.query(`select count(op.productid), p.modelname, op.productid, p.price
                    from orderproduct as op 
                    JOIN products as p
                    on op.productid = p.productid
                    JOIN orders as o
                    on o.orderid = op.orderid
                    JOIN users as u 
                    on u.userid = o.userid
                    where o.orderid = $1 AND u.userid = $2
                    group by p.modelname, op.productid, p.price
                    order by op.productid;`, [req.params.orderid, req.session.userid]).then(result =>{
                        console.log(result.rows);
                        res.send(result.rows);
        });
    } else if (req.session.adminloggedin === true){
        pool.query(`select count(op.productid), p.modelname, op.productid, p.price
                    from orderproduct as op JOIN products as p
                    on op.productid = p.productid 
                    where orderid = $1
                    group by p.modelname, op.productid, p.price
                    order by op.productid;`, [req.params.orderid]).then(result =>{
            res.send(result.rows);
        });
    }
}

 */
//



module.exports = {
    deleteUser,
    updatePassword,
    showInfo,
    showOrder,
    deleteOrder,
    ordersByOrderId
};





