const session = require('express-session');
const bodyParser = require('body-parser');

//Importing the database connection
const pool = require('./Models/db');
//Importing the express server
const app = require('./index.js');

//Ved ikke lige hvad det her gør lol
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//the bodyParser extracts the form data from our html file.
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

module.exports = function (request, response) {
    var rentDay = request.body.rentDay;
    var rentMonth = request.body.rentMonth;
    var rentYear = request.body.rentYear;
    var rentTime = request.body.rentTime;
    var orderAmount1 = request.body.orderAmount1;
    var orderAmount2 = request.body.orderAmount2;
    var orderAmount3 = request.body.orderAmount3;
    var totalPrice = request.body.totalPriceHidden;

    //If no phone is registered, an error is shown:
    if (request.session.phone === undefined) {
        response.send("Session timed out. Please login again and resubmit your order. <br><br><br> <a href='/loginpage.html'>Click here to go to the login page</a>");
    }

    // The following section uses the phone stored in the session to find the corresponding customerid in the database
    var customerID = null;
    pool.query(`SELECT customerid FROM customers WHERE phone =$1`, [request.session.phone], function (error, results) {
        if(error) {
            throw error;
        } else {
            customerID = results.rows[0].customerid;
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
    function createOrder() {
        pool.query(`INSERT INTO orders(
        customerid, 
        orderday, 
        ordermonth, 
        orderyear, 
        timeperiod, 
        orderprice) 
        VALUES($1, $2, $3, $4, $5, $6);
        `, [customerID, rentDay, rentMonth, rentYear, rentTime, totalPrice]);
        createLineItems()
    }

    function createLineItems() {

    }




    /* For at lave produkterne (kør kun hvis de ikke eksisterer)
    pool.query(`INSERT INTO products(
                price, 
                modelname)
                VALUES(
                $1, $2);
                `, [300, "Sea Doo Spark"]);
    pool.query(`INSERT INTO products(
                price, 
                modelname)
                VALUES(
                $1, $2);
                `, [500, "Yamaha Waverunner VX"]);
    pool.query(`INSERT INTO products(
                price, 
                modelname)
                VALUES(
                $1, $2);
                `, [600, "Kawasaki STF-15F"]);

     */
}