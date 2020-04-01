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
function loginFunc (request, response) {
    var fiveHours = 18000000;
    request.session.cookie.maxAge = fiveHours;
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
                console.log(results.rows);
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
}


function checkLogin (request, response){
    if (request.session.loggedin) {
        response.redirect('/profile.html');
    } else {
        response.redirect('/loginpage.html');
        console.log("Venligst log ind");
    }
    response.end();
}

function logOut (request, response){
request.session.loggedin = false;
request.session.phone = undefined;
    console.log("Du har logget ud");
    response.redirect('/loginpage.html');
    response.end();
}

//Denne kode virker ikke helt endnu
function deleteUser(request, response){
    const activePhone = request.session.phone;
    console.log(activePhone);
    pool.query(`DELETE FROM customers where phone = $1`, [activePhone], function (error, results){
        if (error){
            throw error;
        }
        console.log(`Bruger med mobilnummeret ${activePhone} er blevet slettet.`);
        request.session.phone = undefined;
        request.session.loggedin = undefined;
        response.redirect('/');
        response.end();
    }

    )
}




module.exports = {
    loginFunc,
    checkLogin,
    logOut,
    deleteUser
};














