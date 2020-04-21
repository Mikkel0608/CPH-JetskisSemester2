const session = require('express-session');
const bodyParser = require('body-parser');

//Importing the database connection
const pool = require('./Models/db');
//Importing the express server
const app = require('./index.js');

//Ved ikke lige hvad det her gør lol

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
        var randomChars = 'abcdefghijklmnopqrstuvwxyz';
        var ok = false;
        for (let i=0; i<randomChars.length; i++){
            var peppered = password;
            peppered += randomChars[i];
            console.log(peppered);
        pool.query(`select u.userid, u.email, ut.type
                    from users u JOIN usertype ut
                    on u.usertypeid = ut.usertypeid
                    where email = $1 AND password = crypt($2, password);`,
            [email, peppered], function (error, results, fields) {
                if (results.rows.length > 0 && results.rows[0].type === 'cus') {
                    console.log(results.rows);
                    request.session.loggedin = true;
                    request.session.userid = results.rows[0].userid;
                    request.session.email = email;
                    response.redirect('/');
                    ok = true;
                } else if (results.rows.length > 0 && results.rows[0].type === 'adm') {
                    console.log(results.rows);
                    request.session.adminloggedin = true;
                    console.log(request.session.adminloggedin);
                    request.session.userid = results.rows[0].userid;
                    request.session.email = email;
                    response.redirect('/adminpage');
                    ok = true;
                }
            });
            //response.end();
        }

    } else {
        response.send('Please enter phone and password');
        response.end();
    }
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
    logOut,
};














