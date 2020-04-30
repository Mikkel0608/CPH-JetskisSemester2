function authCustomer (req, res, next){
    if (req.session.loggedin !== true) {
        res.status(401);
        return res.send('Log ind for at se sideee' + '<a href="/loginpage.html">Klik her for at logge ind</a>');
    }
    next();
}

function authAdmin (req, res, next){
    console.log(req.session.adminloggedin);
    if (req.session.adminloggedin !== true) {
        res.status(401);
        return res.send('Log ind for at se side' + '<a href="/loginpage.html">Klik her for at logge ind</a>');
    }
    next();
}



module.exports = {
    authCustomer,
    authAdmin
};