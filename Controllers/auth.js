
//Checking that the current user is of customer type
function authCustomer (req, res, next){
    if (req.user.userid) {
                if (req.user.type !== 'cus') {
                    res.status(401);
                    res.send(JSON.stringify('unauthorized'));
                } else {
                    next();
                }
    }
}

//Checking that the url parameter userid is the same as the active user's
function authCustomerId (req, res, next) {
    if (req.user.userid) {
        if (parseInt(req.params.userid) !== req.user.userid) {
            res.status(401);
            return res.send(JSON.stringify('unauthorized'));
        } else {
            res.send(JSON.stringify('ok'));
            next();
        }
    }
}

//Checking that an admin is logged in before proceeding to the next middleware function
function authAdmin (req, res, next){
    if (req.user.userid) {
                if (req.user.type !== 'adm') {
                    res.status(401);
                } else {
                    next();
                }
    }
}



module.exports = {
    authCustomer,
    authCustomerId,
    authAdmin
};