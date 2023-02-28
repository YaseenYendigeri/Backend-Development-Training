// Acquiring all the required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();

// instantiating express and using json()....
const app = express();
app.use(express.json());

// Connecting to Database by using mongoose and dotenv....
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true,
}).then(()=>{
    console.log("DB Connected...");
});

//Acquiring router from router.js....

const allRouters = require('./routes/router');
app.use('/', allRouters);

app.get('/', (req, res)=>{
    res.send("Hello World..");
});


// Listening at port 3000...
app.listen(3000, ()=>{
    console.log("Server's Up and Running on port 3000:");
});