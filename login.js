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
    saveUninitialized: true,
    cookie  : { maxAge  : new Date(Date.now() + (60 * 1000 * 30)) }
}));

//the bodyParser extracts the form data from our Loginpage.html file.
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


//This function takes the form data, and compares it to the data in the database.
function loginFunc (request, response) {
    var fiveHours = 18000000;
    request.session.cookie.maxAge = fiveHours;


    var email = request.body.email;
    //var phone = request.body.phone;
    var password = request.body.password;
    console.log(email, password);
    if (email && password) {
        pool.query(`SELECT usertypeid FROM users WHERE email = $1 AND password = $2`, [email, password], function (error, results, fields) {
           var usertypeid = results.rows[0].usertypeid;
            if (results.rows.length > 0) {
                console.log(results.rows);
                request.session.loggedin = true;
                request.session.userid = results.rows[0].userid;
                request.session.email = email;
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
request.session.email = undefined;
    console.log("Du har logget ud");
    response.redirect('/loginpage.html');
    response.end();
}





module.exports = {
    loginFunc,
    checkLogin,
    logOut
};














