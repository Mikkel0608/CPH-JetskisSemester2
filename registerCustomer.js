//Importing the database connection
const pool = require('./Models/db');

const randomChar = (length) => {
    const randomChars = 'abcdefghijklmnopqrstuvwxyz';
    var result = '';
    let i;
    for (i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
};

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
            if (form_valid === true){
                var usertypeid = null;
                const type = "cus";
                pool.query(`INSERT INTO usertype(type) VALUES ($1) RETURNING userTypeId`, [type], function (error, results) {
                    if (error){
                        throw error;
                    } else{
                        usertypeid = results.rows[0].usertypeid;
                        console.log(usertypeid);
                        createCustomer();
                    }
                });


                function createCustomer() {
                    password += randomChar(1);
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
                `, [usertypeid, name, streetName, streetNumber, postalCode, city, phone, email, password]);
                //response.redirect('/Loginpage.html');
                    request.body.ok = true;
                    console.log(request.body);
                    response.send(request.body);
                }
            }
            //response.end();
        });
        console.log(form_valid);
    });
}

module.exports = {
    register,
    randomChar
};
