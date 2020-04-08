//Importing the database connection
const pool = require('./Models/db');

const app = require('./index.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



function deleteUser(request, response){
    var usertypeid = null;
    const activeEmail = request.session.email;
    console.log(activeEmail);
    pool.query(`DELETE FROM users where email = $1 RETURNING usertypeid`, [activeEmail], function (error, results){
            if (error){
                throw error;
            } else {
                usertypeid = results.rows[0].usertypeid;
                console.log(usertypeid);
            }
            pool.query(`DELETE FROM usertype WHERE usertypeid = $1`, [usertypeid]);
            console.log(`Bruger med e-mail ${activeEmail} er blevet slettet.`);
            request.session.email = undefined;
            request.session.userid = undefined;
            request.session.loggedin = undefined;
            response.redirect('/');
            response.end();
        }
    )
}

function updatePassword(req, res){
    pool.query(`UPDATE users SET password = $1 WHERE userid = $2 `,
        [req.body.newPassword, req.session.userid], function (error, results) {
            if (error){
                throw error;
            }
            //console.log(results.rows);
            res.redirect('/');
            res.end();
        })
}


function infoMW (req, res, next){
    if (req.session.loggedin === true){
        pool.query(`SELECT userid, username, streetname, streetnumber, postalcode, 
                    city, phone, email, created_at FROM users WHERE userid = $1;`,
                    [req.session.userid]).then(result =>{
                        req.user = result.rows[0];
                        next();
        });
    } else {
        next();
    }
}

function showInfo (req, res){
    res.json(req.user)
}


function orderMW (req, res, next){
    if (req.session.loggedin === true){
        pool.query(`SELECT orderid, orderday, ordermonth, timeperiod, orderprice, order_placed_at
                    FROM orders WHERE userid = $1;`,
                    [req.session.userid]).then(result =>{
                        req.order = result.rows;
                        next();
                    });
    } else {
        next();
    }
}

function showOrder (req, res){
    res.json(req.order);
}


module.exports = {
    deleteUser,
    updatePassword,
    showInfo,
    infoMW,
    orderMW,
    showOrder
};






