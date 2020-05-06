//Importing the database connection
const pool = require('../Models/db');

//Function that validates a log-in attempt
//The function adds a pepper to the password. The pepper can be any of the lowercase english letters, so queries to the
//database are made with every lowercase letter added to the password.
//Response sent back to determine whether the log-in was made by an admin or a customer.
//Frontend redirects based on this response.
function loginFunc (request, response) {
    request.session.cookie.maxAge = 18000000;
    var email = request.body.email;
    var password = request.body.password;
    console.log(email, password);

    if (email && password) {
        var randomChars = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < randomChars.length; i++) {
            var peppered = password;
            peppered += randomChars[i];

            //querying the database to see if there are any results matching the log-in attempt.
            pool.query(`select u.userid, u.email, ut.type
                        from users u JOIN usertype ut
                        on u.usertypeid = ut.usertypeid
                        where email = $1 AND password = crypt($2, password);`,
            [email, peppered], function (error, results, fields) {
                if (results.rows.length > 0 && results.rows[0].type === 'cus') {
                    request.session.adminloggedin = false;
                    request.session.loggedin = true;
                    request.session.userid = results.rows[0].userid;
                    request.session.email = email;
                    response.send(JSON.stringify('cus'));
                } else if (results.rows.length > 0 && results.rows[0].type === 'adm') {
                    console.log(results.rows);
                    request.session.loggedin = false;
                    request.session.adminloggedin = true;
                    request.session.userid = results.rows[0].userid;
                    request.session.email = email;
                    response.send(JSON.stringify('adm'));
                }
            });
        }
    } else {
        response.send('Please enter phone and password');
    }
}

//Function that logs the current user out
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














