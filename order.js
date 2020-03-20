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

//the bodyParser extracts the form data from our orderPage.html file.
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

module.exports = function (request, response) {
    var rentDayID = request.body.rentDay;
    var rentDayValue = rentDayID.options[rentDayID.selectedIndex].value;

}