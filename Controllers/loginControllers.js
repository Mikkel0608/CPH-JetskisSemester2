//Importing the database connection
const pool = require('../Models/db');
const jwt = require('jsonwebtoken');


//Function that validates a log-in attempt
//Querying the database to see whether there is a match or not
//Sets a cookie on the request object if there is a match
//Response sent back to determine whether the log-in was made by an admin or a customer.
//Frontend redirects based on this response.
const secret = 'secretsecretsecret';
function loginFunc (request, response) {
    var email = request.body.email;
    var password = request.body.password;
    if (email && password) {
            //querying the database to see if there are any results matching the log-in attempt.
            pool.query(`select u.userid, u.email, ut.type
                        from users u JOIN usertype ut
                        on u.usertypeid = ut.usertypeid
                        where email = $1 AND password = crypt($2, password);`,
            [email, password], function (error, results, fields) {
                if (results.rows.length > 0 && results.rows[0].type === 'cus') {
                    const token = jwt.sign({userId: results.rows[0].userid}, secret);
                    response.cookie('jwt-token', token, {maxAge: 90000000, overwrite: true} );
                    response.send(JSON.stringify('cus'));

                } else if (results.rows.length > 0 && results.rows[0].type === 'adm') {
                    const token = jwt.sign({userId: results.rows[0].userid}, secret);
                    response.cookie('jwt-token', token, {maxAge: 90000000, overwrite: true} );
                    response.send(JSON.stringify('adm'));

                } else {
                    response.send(JSON.stringify('Ingen bruger fundet. Prøv igen eller opret en ny bruger.'));
                }
            });
        } else {
            response.send(JSON.stringify('Please enter phone and password'));
    }
}

//Function that logs the current user out by clearing the cookie
function logOut (request, response){
    response.clearCookie('jwt-token');
    response.send(JSON.stringify('ok'));
}

//Middleware that sets the active user by checking the jwt that gets stored in a cookie
//Creates a 'user' property on the request object, so it is available in other route handlers
//user property also contains the type, so the system can distinguish between admin and customers
function setUser (req, res, next){
    if (req.cookies && req.cookies['jwt-token']) {
        const userid = jwt.verify(req.cookies['jwt-token'], secret);

        pool.query (`SELECT u.userid, ut.type, u.username, u.streetname, u.streetnumber, u.postalcode,
                     u.city, u.phone, u.email, u.created_at FROM users u
                     JOIN usertype ut
                     on u.usertypeid = ut.usertypeid
                     WHERE userid = $1;`, [userid.userId])
            .then(result => {
                req.user = result.rows[0];
                console.log(req.user);
                next();
            })
    } else {
        next();
    }
}




module.exports = {
    loginFunc,
    logOut,
    setUser,
};














