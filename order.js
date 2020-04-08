//Importing the database connection
const pool = require('./Models/db');

const app = require('./index.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getOrders (request, response) {
    var rentDay = request.body.orderDay;
    var rentMonth = request.body.orderMonth;
    var rentYear = request.body.orderYear;
    var rentTime = request.body.timePeriod;

    var orderid = null;
    pool.query(`SELECT orderid FROM orders WHERE orderday =$1 AND ordermonth =$2 AND orderyear =$3 AND timeperiod =$4`,
        [rentDay, rentMonth, rentYear, rentTime], function (error, results) {
        if(error) {
            throw error;
        } else {
            console.log(results.rows);
            for (let i=0; i<results.rows.length; i++)
                pool.query(`SELECT orderproductid FROM orderproduct WHERE `)
            orderid = results.rows[0].orderid;
        }
        });
}

function submitOrder (request, response) {
    var rentDay = request.body.orderDay;
    var rentMonth = request.body.orderMonth;
    var rentYear = request.body.orderYear;
    var rentTime = request.body.timePeriod;
    var orderAmount1 = request.body.amount1;
    var orderAmount2 = request.body.amount2;
    var orderAmount3 = request.body.amount3;
    var totalPrice = request.body.orderPrice;

    //If no phone is registered, an error is shown:
    if (request.session.email === undefined) {
        response.send("Session timed out. Please login again and resubmit your order. <br><br><br> <a href='/loginpage.html'>Click here to go to the login page</a>");
    }

    // The following section uses the email stored in the session to find the corresponding customerid in the database
    var userid = null;
    pool.query(`SELECT userid FROM users WHERE email =$1`, [request.session.email], function (error, results) {
        if(error) {
            throw error;
        } else {
            console.log(results.rows);
            userid = results.rows[0].userid;
            createOrder();
        }
    });
    /* Denne kode skal nok ikke bruges, ser ud til at virke uden
    function setIdResult(foundID) {
        customerID = foundID;
        console.log([rentDay, rentMonth, rentYear, rentTime, orderAmount1, orderAmount2, orderAmount3, totalPrice, customerID]);
        createOrder();

    }

     */
    //Creates the order row in the DB from the collected information
    var orderId = null;
    function createOrder() {
        pool.query(`INSERT INTO orders(
        userid, 
        orderday, 
        ordermonth, 
        orderyear, 
        timeperiod, 
        orderprice) 
        VALUES($1, $2, $3, $4, $5, $6) RETURNING orderid;
        `, [userid, rentDay, rentMonth, rentYear, rentTime, totalPrice], function (error, result) {
            if(error) {
                throw error;
            } else {
                orderId = result.rows[0].orderid;
                console.log(orderId);
                createOrderProducts();
            }
        });
    }

    function createOrderProducts() {
        if (orderAmount1>0) {
            for (let i = 0; i < orderAmount1; i++) {
                pool.query(`INSERT INTO orderproduct(
            productid,
            orderid)
            VALUES($1, $2);
            `, [1, orderId])
            }
        }
        if (orderAmount2>0) {
            for (let i = 0; i < orderAmount2; i++) {
                pool.query(`INSERT INTO orderproduct(
            productid,
            orderid)
            VALUES($1, $2);
            `, [2, orderId])
            }
        }
        if (orderAmount3>0) {
            for (let i = 0; i < orderAmount3; i++) {
                pool.query(`INSERT INTO orderproduct(
            productid,
            orderid)
            VALUES($1, $2);
            `, [3, orderId])

            }
        }
    }
}
module.exports = {
    submitOrder
};