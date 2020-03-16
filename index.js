const express = require('express');
const path = require('path');
const app = express();

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
    res.sendFile(path.resolve(__dirname, 'html/orderPage.html'))
});
app.get('/profile.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'html/profile.html'))
});
app.get('/orderConfirmation.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'html/orderConfirmation.html'))
});
app.get('/Register2.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'html/Register2.html'))
});
app.get('/Changeuser.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'html/Changeuser.html'))
});
app.get('/Changeorder.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'html/Changeorder.html'))
});
app.get('/Adminpage.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'html/Adminpage.html'))
});
app.get('/Calendar.html',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'html/Calendar.html'))
});



