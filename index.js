const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const auth = require('./Controllers/auth.js');
const loginFunction = require('./Controllers/loginControllers.js');
const profileFunctions = require('./Controllers/profileControllers.js');
const registerFunction = require('./Controllers/registerControllers');
const orderFunction = require('./Controllers/orderControllers.js');
const adminFunctions = require ('./Controllers/adminControllers.js');



const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:63342'}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('views'));
app.listen(3000, ()=>{
    console.log("App listening on port 3000")
});

app.post('/loginpage/auth', loginFunction.loginFunc);


//global middleware function to set the active user
app.use(loginFunction.setUser);


app.get('/profile/logout', loginFunction.logOut);
app.get('/profile/user', auth.authCustomer, profileFunctions.showInfo);
app.get('/profile/orders', auth.authCustomer,  profileFunctions.showOrder);
app.get('/profile/ordersbyorderid/:orderid', profileFunctions.ordersByOrderId);
app.put('/profile/updatepassword/update/:userid', auth.authCustomer, auth.authCustomerId, profileFunctions.updatePassword);
app.delete('/profile/user/:userid', auth.authCustomer, auth.authCustomerId, profileFunctions.deleteUser);
app.delete('/profile/orders/:orderid', auth.authCustomer, profileFunctions.deleteOrder);


app.post('/orderPage/submitOrder', auth.authCustomer, orderFunction.submitOrder);
app.post('/orderPage/products', auth.authCustomer, orderFunction.getProducts);


app.get('/adminpage/user/:userid', auth.authAdmin, adminFunctions.getUser);
app.get('/adminpage/allusers', auth.authAdmin, adminFunctions.getUsers);
app.get('/adminpage/allOrders/:sorting', auth.authAdmin, adminFunctions.allOrders);
app.get('/adminpage/ordersByUser/:userid', auth.authAdmin, adminFunctions.getOrdersByUser);


app.post('/register', registerFunction.register);





