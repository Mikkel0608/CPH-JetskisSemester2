const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
module.exports = app;

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie  : { maxAge  : new Date(Date.now() + (60 * 1000 * 30)) }
}));


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

app.use(express.static('views'));
app.listen(3000, ()=>{
    console.log("App listening on port 3000")
});

//html fil for forsiden bliver vist
app.get('/',(req, res)=>{
    res.sendFile(path.resolve(__dirname, 'html/index.html'))
});
//html fil for login side bliver vist
app.get('/Loginpage.html', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'html/Loginpage.html'))
});
app.get('/index.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'html/index.html'))
});
app.get('/orderPage.html',(req,res)=>{
    if (req.session.loggedin === true) {
        res.sendFile(path.resolve(__dirname, 'html/orderpage.html'))
    } else {
        res.send('Log ind for at se side' + '<a href="/loginpage.html">Klik her for at logge ind</a>');
    }
});
app.get('/profile.html',(req,res)=>{
    if (req.session.loggedin === true) {
        res.sendFile(path.resolve(__dirname, 'html/profile.html'))
    } else {
        res.send('Log ind for at se side' + '<a href="/loginpage.html">Klik her for at logge ind</a>');
    }
});
app.get('/profile/updatePassword', (req, res)=>{
    if (req.session.loggedin === true) {
        res.sendFile(path.resolve(__dirname, 'html/updatePassword.html'))
    } else {
        res.send('Log ind for at se side' + '<a href="/loginpage.html">Klik her for at logge ind</a>');
    }
});
app.get('/orderConfirmation.html',(req,res)=>{
    if (req.session.loggedin === true) {
        res.sendFile(path.resolve(__dirname, 'html/orderConfirmation.html'))
    } else {
        res.send('Log ind for at se side' + '<a href="/loginpage.html">Klik her for at logge ind</a>');
    }
});
app.get('/Register2.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'html/Register2.html'))
});
app.get('/Adminpage/showuser',(req,res)=>{
    if (req.session.adminloggedin === true) {
        res.sendFile(path.resolve(__dirname, 'html/Changeuser.html'))
    } else {
        res.send('Log ind for at se side' + '<a href="/loginpage.html">Klik her for at logge ind</a>');
    }
});
app.get('/Changeorder.html',(req,res)=>{
    if (req.session.adminloggedin === true) {
        res.sendFile(path.resolve(__dirname, 'html/Changeorder.html'))
    } else {
        res.send('Log ind for at se side' + '<a href="/loginpage.html">Klik her for at logge ind</a>');
    }
});
app.get('/Adminpage',(req,res)=>{
    if (req.session.adminloggedin === true) {
        res.sendFile(path.resolve(__dirname, 'html/Adminpage.html'))
    } else {
        res.send('Log ind for at se side' + '<a href="/loginpage.html">Klik her for at logge ind</a>');
    }
});

//require functions from login.js
const loginFunction = require('./login.js');
//login validation
app.post('/loginpage/auth', loginFunction.loginFunc);
app.get('/profile/logout', loginFunction.logOut);

const profileFunctions = require('./profile.js');
app.use(profileFunctions.infoMW);
app.use(profileFunctions.orderMW);
app.get('/profile/user', profileFunctions.showInfo);
app.get('/profile/orders', profileFunctions.showOrder);
app.get('/profile/ordersbyorderid/:orderid', profileFunctions.ordersByOrderId);
app.get('/profile/orderproduct/:orderid', profileFunctions.orderProduct);
app.put('/profile/updatepassword/update/:userid', profileFunctions.updatePassword);
app.delete('/profile/user/:userid', profileFunctions.deleteUser);
app.delete('/profile/orders/:orderid', profileFunctions.deleteOrder);


const registerFunction = require('./registerCustomer');
app.post('/register', registerFunction.register);

// creating new order
const orderFunction = require('./order.js');
app.post('/orderPage/submitOrder', orderFunction.submitOrder);
app.post('/orderPage/products', orderFunction.getProducts);

//adminpage
const adminFunctions = require ('./admin.js');
app.use(adminFunctions.getUsersMW);
app.get('/adminpage/allusers', adminFunctions.getUsers);
app.get('/adminpage/allOrders/:sorting', adminFunctions.allOrders);
app.get('/adminpage/ordersByUser/:userid', adminFunctions.getOrdersByUser);
app.get('/adminpage/order/:orderid', adminFunctions.getOrder);







