const express = require("express")
const app = express()

//tillader vores "app" at tage imod JSON
app.use(express.json())

// tomt array til users
const users = []

app.get("/users", (req, res)=>{
    res.json(users)
})

app.post("/users", (req, res) =>{
const user = {name: req.body.name, password:req.body.password}
users.push()
})

app.listen(3000)