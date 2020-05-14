//Importing the database connection
const pool = require('../Models/db');


//The getProducts function is requested after the client selects a date/time
function getProducts(request, response) {
    var selectedDay = request.body.rentDayValue;
    var selectedMonth = request.body.rentMonthValue;
    var selectedYear = request.body.rentYearValue;
    var selectedTime = request.body.rentTimeValue;
    var foundProducts;
    //The function first queries all the products in the database
    pool.query(`SELECT productid, price, modelname, modeldescription, quantity, imagesrc FROM products`,
        function (error, results) {
            if (error) {
                throw error;
            } else {
                //The products from the databased are saved to a variable
                foundProducts = results.rows;
                //The API queries the database for the amount of orderproducts for each product on the requested time/date.
                pool.query(`SELECT count(op.productid), op.productid
                        FROM orderproduct as op JOIN orders as o
                        ON op.orderid = o.orderid
                        WHERE orderday=$1 AND ordermonth=$2 AND orderyear=$3 AND timeperiod=$4
                        GROUP BY op.productid
                        ORDER BY op.productid`,
                    [selectedDay, selectedMonth, selectedYear, selectedTime], function (error, results) {
                        if (error) {
                            throw error;
                        } else {
                            console.log(results.rows);
                            //For each product in the database, the quantity is adjusted in the foundProducts array
                            for (let i = 0; i < results.rows.length; i++) {
                                for (let x = 0; x < foundProducts.length; x++) {
                                    if (foundProducts[x].productid === results.rows[i].productid) {
                                        foundProducts[x].quantity -= parseInt(results.rows[i].count);
                                    }
                                }
                            }
                            console.log("responded to request");
                            //The foundProducts array has now been updated to reflect existing orders, and is now send to the frontend as a response.
                            response.send(foundProducts);
                        }
                    });
            }
        });
}

//The submitOrder function receives the order information in a post request, and creates the order and orderproducts in the database.
function submitOrder(request, response) {
    var rentDay = request.body.orderDay;
    var rentMonth = request.body.orderMonth;
    var rentYear = request.body.orderYear;
    var rentTime = request.body.timePeriod;
    var products = request.body.products;
    var totalPrice = request.body.orderPrice;
    //Creates the order row in the DB from the collected information. The orderid of the created order is returned and saved to the orderId var.
    var orderId = null;
    pool.query(`INSERT INTO orders(
        userid, 
        orderday, 
        ordermonth, 
        orderyear, 
        timeperiod, 
        orderprice) 
        VALUES($1, $2, $3, $4, $5, $6) RETURNING orderid;
        `, [request.user.userid, rentDay, rentMonth, rentYear, rentTime, totalPrice], function (error, result) {
        if (error) {
            throw error;
        } else {
            orderId = result.rows[0].orderid;
            console.log(orderId);
            createOrderProducts();
        }
    });

    //Creates the OrderProducts and inserts the orderid from the created previously created order.
    function createOrderProducts() {
        for (let i = 0; i < products.length; i++) {
            for (let x = 0; x < products[i].quantity; x++) {
                pool.query(`INSERT INTO orderproduct(
                productid,
                orderid)
                VALUES($1, $2);
            `, [products[i].productId, orderId])
            }
        }
        response.send(JSON.stringify('ok'));
    }
}

module.exports = {
    submitOrder,
    getProducts
};