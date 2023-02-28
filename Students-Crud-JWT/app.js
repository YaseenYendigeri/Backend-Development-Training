const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const allRouters = require("./Routes/router");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', allRouters);
app.use(express.json());
require("dotenv").config();

mongoose.connect(process.env.DB, {useNewUrlParser:true});

app.get("/", (req, res)=>{
    res.send("Welcome to Home page....");
});

app.listen(3000, ()=>{
    console.log("Server's Up and Running on Port 3000.....");
});