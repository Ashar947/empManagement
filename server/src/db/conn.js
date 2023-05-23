const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/mern",{
}).then (()=>{
    console.log("Connection Succesful");
}).catch((err)=>{
    console.log(`${err}`);
});
// mongoose.connect("mongodb://localhost:27017/HRM");




    
