//Importing the database connection
const pool = require('./Models/db');
const registerFunction = require('./registerCustomer');

const app = require('./index.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



function deleteUser(request, response){
    if (parseInt(request.params.userid) === request.session.userid) {
        var usertypeid = null;
        const activeEmail = request.session.email;
        console.log(activeEmail);
        pool.query(`SELECT u.userid, ut.usertypeid
                FROM users AS u JOIN usertype AS ut
                ON u.usertypeid = ut.usertypeid
                WHERE userid = $1;`, [request.params.userid], function (error, results) {
                if (error) {
                    throw error;
                } else {
                    usertypeid = results.rows[0].usertypeid;
                    console.log(usertypeid);

                    pool.query(`DELETE FROM usertype WHERE usertypeid = $1`, [usertypeid]);
                    console.log(`Bruger med e-mail ${activeEmail} er blevet slettet.`);
                    request.session.email = undefined;
                    request.session.userid = undefined;
                    request.session.loggedin = undefined;
                    response.send(JSON.stringify('ok'));
                }
            }
        )
    }
}

function deleteOrder (req, res){
    pool.query(`DELETE FROM orders WHERE orderid = $1 AND userid = $2`,
    [req.params.orderid, req.session.userid]);
    res.send(JSON.stringify('ok'));
}

function updatePassword(req, res){
    console.log(req.body);
    req.body.password += registerFunction.randomChar(1);
    pool.query(`UPDATE users SET password = crypt($1, gen_salt('bf')) WHERE userid = $2 `,
        [req.body.password, req.params.userid], function (error, results) {
            if (error){
                throw error;
            } else {
                console.log(results.rows);
                res.send(JSON.stringify('ok'));
            }
        })
}


function infoMW (req, res, next){
    if (req.session.loggedin === true){
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

function showInfo (req, res){
    res.json(req.user)
}


function orderMW (req, res, next){
    if (req.session.loggedin === true){
        pool.query(`SELECT orderid FROM orders WHERE userid = $1;`,
                    [req.session.userid]).then(result =>{
                        req.order = result.rows;
                        next();
                    });
    } else {
        next();
    }
}


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
                /*
                for (let i = 0; i < products.length; i++) {
                    order.products.push(products[i]);
                }
                 */
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
                /*
                for (let i = 0; i < products.length; i++) {
                    order.products.push(products[i]);
                }
                 */
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

function showOrder (req, res){
    res.json(req.order);
}


module.exports = {
    deleteUser,
    updatePassword,
    showInfo,
    infoMW,
    orderMW,
    showOrder,
    //orderProduct,
    deleteOrder,
    ordersByOrderId
};






