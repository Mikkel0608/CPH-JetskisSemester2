const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const auth = require('./Controllers/auth.js');
const loginFunction = require('./Controllers/login.js');
const profileFunctions = require('./Controllers/profile.js');
const registerFunction = require('./Controllers/registerCustomer');
const orderFunction = require('./Controllers/order.js');
const adminFunctions = require ('./Controllers/admin.js');



const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('views'));
app.listen(3000, ()=>{
    console.log("App listening on port 3000")
});



app.get('/',(req, res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/index.html'))
});
app.get('/Loginpage.html', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/Loginpage.html'))
});
app.get('/index.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/index.html'))
});
app.get('/orderPage.html', auth.authCustomer, (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/orderpage.html'))
});
app.get('/profile.html', auth.authCustomer, (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/profile.html'))
});
app.get('/profile/updatePassword', auth.authCustomer, (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/updatePassword.html'))
});
app.get('/orderConfirmation.html', auth.authCustomer, (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/orderConfirmation.html'))
});
app.get('/register.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/register.html'))
});
app.get('/Adminpage/showuser', auth.authAdmin, (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/admin_users.html'))
});
app.get('/admin_orders.html', auth.authAdmin, (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/admin_orders.html'))
});
app.get('/Adminpage', auth.authAdmin, (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'views/html/Adminpage.html'))
});

//login and logout
app.post('/loginpage/auth', loginFunction.loginFunc);
app.get('/profile/logout', auth.authCustomer, loginFunction.logOut);


app.get('/profile/user', auth.authCustomer, profileFunctions.showInfo);
app.get('/profile/orders', auth.authCustomer,  profileFunctions.showOrder);
app.get('/profile/ordersbyorderid/:orderid', profileFunctions.ordersByOrderId);
app.put('/profile/updatepassword/update/:userid', auth.authCustomer, auth.authCustomerId, profileFunctions.updatePassword);
app.delete('/profile/user/:userid', auth.authCustomer, auth.authCustomerId, profileFunctions.deleteUser);
app.delete('/profile/orders/:orderid', auth.authCustomer , profileFunctions.deleteOrder);


app.post('/register', registerFunction.register);

// creating new order
app.post('/orderPage/submitOrder', auth.authCustomer, orderFunction.submitOrder);
app.post('/orderPage/products', auth.authCustomer, orderFunction.getProducts);

//adminpage
app.get('/adminpage/user/:userid', auth.authAdmin, adminFunctions.getUser);
app.get('/adminpage/allusers', auth.authAdmin, adminFunctions.getUsers);
app.get('/adminpage/allOrders/:sorting', auth.authAdmin, adminFunctions.allOrders);
app.get('/adminpage/ordersByUser/:userid', auth.authAdmin, adminFunctions.getOrdersByUser);
app.get('/adminpage/order/:orderid', auth.authAdmin, adminFunctions.getOrder);




module.exports = app;





