//Importing the database connection
const pool = require('./Models/db');



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
        //var ok = false;
            for (let i = 0; i < randomChars.length; i++) {
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
                            response.send(JSON.stringify('cus'));
                        } else if (results.rows.length > 0 && results.rows[0].type === 'adm') {
                            console.log(results.rows);
                            request.session.adminloggedin = true;
                            console.log(request.session.adminloggedin);
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














