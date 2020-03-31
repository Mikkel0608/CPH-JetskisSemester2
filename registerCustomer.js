const session = require('express-session');
const bodyParser = require('body-parser');

//Importing the database connection
const pool = require('./Models/db');
//Importing the express server
const app = require('./index.js');

//Ved stadig ikke hvad dette gør
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//used for extracting form data
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

module.exports = function (request, response){
    const customerName = request.body.customerName;
    const streetName = request.body.streetName;
    const streetNumber = request.body.streetNumber;
    const postalCode = request.body.postalCode;
    const city = request.body.city;
    const phone = request.body.phone;
    const email = request.body.email;
    const password = request.body.password;
    console.log(customerName, streetName, streetNumber, postalCode, city, phone, email, password);

    //Making sure that it is not possible to register the same email or phone number
    var form_valid = true;
    var responseText = "";
    pool.query(`SELECT * FROM customers WHERE phone = $1`, [phone], function (error, results, fields) {
        if (results.rows.length > 0) {
            form_valid = false;
            responseText+='Mobilnummeret er allerede registreret\n';
        }


        pool.query(`SELECT * FROM customers WHERE email = $1`, [email], function (error, results, fields) {
            if (results.rows.length > 0) {
                form_valid = false;
                responseText+='Email-addressen er allerede registreret';
            }
            if(form_valid === false) {
                response.send(responseText);
            }

            if (form_valid === true){
                pool.query(`INSERT INTO customers(
                customerName, 
                streetName,
                streetNumber,
                postalCode,
                city,
                phone,
                email,
                password)
                VALUES(
                $1, $2, $3, $4, $5, $6, $7, $8);
                `, [customerName, streetName, streetNumber, postalCode, city, phone, email, password]);
                response.redirect('/Loginpage.html');
            }
            response.end();
        });
        console.log(form_valid);
    });
};