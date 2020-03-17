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

//the bodyParser extracts the form data from our Loginpage.html file.
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//This function takes the form data, and compares it to the data in the database.
module.exports = function (request, response) {
    var phone = request.body.phone;
    var password = request.body.password;
    console.log(phone, password);
        if (phone && password) {
            pool.query(`SELECT * FROM customers WHERE phone = $1 AND password = $2`, [phone, password], function (error, results, fields) {
                //console.log(error);
                //console.log(results);
                //The results from the query contain a rows object, which has an array of the results
                //If the row has a length of more than 0 there is a match
                if (results.rows.length > 0) {
                    request.session.loggedin = true;
                    request.session.phone = phone;
                    response.redirect('/');
                } else {
                    response.send('Incorrect phone and/or password');
                }
                response.end();
            });
        } else {
            response.send('Please enter phone and password');
            response.end();
        }
};









