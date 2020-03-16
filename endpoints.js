const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.listen(3000, ()=>{
    console.log("App listening on port 3000")
});

//html fil for forsiden bliver vist
app.get('/',(req, res)=>{
    res.sendFile(path.resolve(__dirname, 'html/index.html'))
});

//html fil for login side bliver vist
app.get('/Loginpage', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'html/Loginpage.html'))
});



