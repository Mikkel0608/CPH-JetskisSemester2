// import: Express-session
const session = require('express-session');
// Import: bodyParser
const bodyParser = require('body-parser');

// Import: DB
const pool = require('./Models/db');
//Import: Express server
const app = require('./index.js');

// TODO Hvad gør dette stykke kode?
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//the bodyParser extracts the form data from our orderPage.html file.
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
