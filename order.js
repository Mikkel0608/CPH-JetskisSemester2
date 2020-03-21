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

//the bodyParser extracts the form data from our orderPage.html file.
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
    console.log([rentDay, rentMonth, rentYear, rentTime, orderAmount1, orderAmount2, orderAmount3, totalPrice]);





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