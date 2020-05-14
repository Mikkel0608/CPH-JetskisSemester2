//Importing the database connection
const pool = require('../Models/db');

//Function that creates a new customer in the database.
//The function checks to make sure that the phone and/or email don't already exist in the database
function register (request, response){
    const name = request.body.name;
    const streetName = request.body.streetName;
    const streetNumber = request.body.streetNumber;
    const postalCode = request.body.postalCode;
    const city = request.body.city;
    const phone = request.body.phone;
    const email = request.body.email;
    var password = request.body.password;
    console.log(name, streetName, streetNumber, postalCode, city, phone, email, password);


    //Making sure that it is not possible to register the same email or phone number
    var form_valid = true;
    var responseText = "";
    pool.query(`SELECT * FROM users WHERE phone = $1`, [phone], function (error, results, fields) {
        if (results.rows.length > 0) {
            form_valid = false;
            responseText+='Mobilnummeret er allerede registreret\n';
        }
    pool.query(`SELECT * FROM users WHERE email = $1`, [email], function (error, results, fields) {
        if (results.rows.length > 0) {
            form_valid = false;
            responseText+='Email-addressen er allerede registreret';
        }
        if(form_valid === false) {
            response.send(JSON.stringify(responseText));
        }

        //Creating a new customer by inserting into users table
            if (form_valid === true) {
                var userTypeId = 2;
                pool.query(`INSERT INTO users(
                usertypeid,
                userName, 
                streetName,
                streetNumber,
                postalCode,
                city,
                phone,
                email,
                password)
                VALUES(
                $1, $2, $3, $4, $5, $6, $7, $8, crypt($9, gen_salt('bf')));
                `, [userTypeId, name, streetName, streetNumber, postalCode, city, phone, email, password]);
                request.body.ok = true;
                response.send(request.body);
            }
    });
        console.log(form_valid);
    });
}

module.exports = {
    register
};
