const express = require('express');
const app = express();

require('./db/conn'); //Database Connection
// ENV Setup
const dotenv = require('dotenv')
const multer = require("multer");
dotenv.config({path:'/config.env'});
// ---------------------
// Importing Model
const User = require('./models/userSchema')
// ---------------------
app.use(express.json());
// Router Setup
const cookieParser = require('cookie-Parser')
const authenticate = require('./middleware/authenticate');

app.use(require('./router/auth'));




app.get('/', (req,res) => {
    res.send("Mern Website")
    next();
})

app.get('/contact', (req,res) => {
    res.send("Mern Website contact")
})

app.listen(5000,()=>{
    console.log("Server is running at port 5000 .")
})