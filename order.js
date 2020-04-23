//Importing the database connection
const pool = require('./Models/db');

const app = require('./index.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//MM: The getProducts function is requested after the client selects a date/time
function getProducts (request, response) {
    var selectedDay = request.body.rentDayValue;
    var selectedMonth = request.body.rentMonthValue;
    var selectedYear = request.body.rentYearValue;
    var selectedTime = request.body.rentTimeValue;
    var foundProducts;
    //MM: The function first queries all the products in the database
    pool.query(`SELECT productid, price, modelname, modeldescription, maxamount, imagesrc FROM products`,
        function (error, results) {
        if(error) {
            throw error;
        } else {
            //MM: The products from the databased are saved to a variable
            foundProducts = results.rows;
            //MM: The API queries the database for the amount of orderproducts for each product on the requested time/date.
            pool.query(`SELECT count(op.productid), op.productid
                        FROM orderproduct as op JOIN orders as o
                        ON op.orderid = o.orderid
                        WHERE orderday=$1 AND ordermonth=$2 AND orderyear=$3 AND timeperiod=$4
                        GROUP BY op.productid
                        ORDER BY op.productid`,
                        [selectedDay, selectedMonth, selectedYear, selectedTime], function(error, results) {
                if(error) {
                    throw error;
                } else {
                    console.log(results.rows);
                    //MM: For each product in the database, the quantity is adjusted in the foundProducts array
                    for (let i = 0; i<results.rows.length; i++) {
                        foundProducts[i].maxamount -= parseInt(results.rows[i].count);
                        console.log()
                    }
                    console.log("responded to request");
                    //MM: The foundProducts array has now been updated to reflect existing orders, and is now send to the frontend as a response.
                    response.send(foundProducts);
                }
                });
        }
    });
}
//MM: The submitOrder function receives the order information in a post request, and creates the order and orderproducts in the database.
function submitOrder (request, response) {
    var rentDay = request.body.orderDay;
    var rentMonth = request.body.orderMonth;
    var rentYear = request.body.orderYear;
    var rentTime = request.body.timePeriod;
    var selectedProducts = request.body.selectedProducts;
    var totalPrice = request.body.orderPrice;

    //MM: If no active userid can be found, an error is send as response.
    if (request.session.userid === undefined) {
        response.send("Session timed out. Please login again and resubmit your order. <br><br><br> <a href='/loginpage.html'>Click here to go to the login page</a>");
    }

    //MM: The following query uses the email stored in the session to find the corresponding customerid in the database
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
    //MM: Creates the order row in the DB from the collected information. The orderid of the created order is returned and saved to the orderId var.
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
    //MM: Creates the OrderProducts and inserts the orderid from the created previously created order.
    function createOrderProducts() {
        for (let i=0; i<selectedProducts.length; i++) {
            for (let x=0; x<selectedProducts[i].productAmount; x++) {
                pool.query(`INSERT INTO orderproduct(
                productid,
                orderid)
                VALUES($1, $2);
            `, [selectedProducts[i].productid, orderId])
            }
        }
    }
}
module.exports = {
    submitOrder,
    getProducts
};