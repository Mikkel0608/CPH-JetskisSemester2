function authCustomer (req, res, next){
    if (req.session.loggedin !== true) {
        res.status(401);
        return res.send('Log ind for at se side' + '<a href="/loginpage.html">Klik her for at logge ind</a>');
    }
    next();
}

function authCustomerId (req, res, next) {
    if (parseInt(req.params.userid) !== req.session.userid) {
        res.status(401);
        res.send('Not authorized');
    } else {
        next();
    }
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
    authAdmin,
    authCustomerId
};