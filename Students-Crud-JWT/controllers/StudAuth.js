const stud = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {expressjwt:jWt} = require("express-jwt");
const Users = require("../models/Users");
require('cookie-parser');
require('dotenv').config();

exports.signup = async(req, res)=>{
    try{
        const usn = req.body.usn;
        const password = req.body.password;
        
        if(!(usn && password)){
            res.status(400).send("All Fields are Required, Please Try Again..")
        }
        const oldUser = await Users.findOne({usn});
        if(oldUser){
            return res.status(409).send("User Already exists. Please Login");
        }

        encryptedPassword = await bcrypt.hash(password, 10);
        const stud = await Users.create({
            usn, password : encryptedPassword
        });
        res.send(stud);

    }catch(err){
        console.error(err);
        res.status(400).json({
            error: "Please Enter Your usn and password"
        });
    }
}

exports.signIn = async(req, res)=>{
    try{
        const {usn, password} = req.body;
        const stud = await Users.findOne({usn});

        if(!stud){
            res.status(404).send("Not Found..Please Try Signning Up or Check your password...");
        }

        const passwordCompare = await bcrypt.compare(password, stud.password);

        if(passwordCompare){
            const token = jwt.sign
            (
                {
                id:stud._id,
                usn:stud.usn
                },
                process.env.JWT_SECRET,{
                    expiresIn:86400
                }
            )
            return res.json({stud, token:token});
        }else{
            return res.json({Status: "Error", Error: "Check the Password Again."})
        }

    }catch(Err){
        console.log(Err);
    }
}

exports.isSignedIn = jWt({ 
    secret:process.env.JWT_SECRET,
    userProperty:'auth',
    algorithms: ['HS256']
});