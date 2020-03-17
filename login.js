const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
//const Pool = require('pg').Pool;

const pool = require('./Models/db');

const app = express();
app.use(express.static('views'));
app.listen(3000);


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/Loginpage.html', function(request, response) {
    response.sendFile(path.join(__dirname + '/html/Loginpage.html'));
});


/*module.exports*/app.post('/auth', function (request, response) {
    const phone = request.body.phone;
    const password = request.body.password;
    console.log(phone, password);
        if (phone && password) {
            pool.query('SELECT * FROM customers WHERE phone = $1 AND password = $2', [phone, password], function (error, results, fields) {
                console.log(results.length);
                if (results.length > 0) {
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
});





