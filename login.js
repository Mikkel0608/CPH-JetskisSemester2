const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const pool = require('./Models/db');
const app = require('./index.js');

app.use(express.static('views'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

/*app.get('/Loginpage.html', function(request, response) {
    response.sendFile(path.join(__dirname + '/html/Loginpage.html'));
});
*/
module.exports = function (request, response) {
    var phone = request.body.phone;
    var password = request.body.password;
    console.log(phone, password);
        if (phone && password) {
            pool.query(`SELECT * FROM customers WHERE phone = $1 AND password = $2`, [phone, password], function (error, results, fields) {
                console.log(error);
                console.log(results);
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





