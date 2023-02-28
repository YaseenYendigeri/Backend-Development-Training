const user = require("../models/Users");
const jwt = require('jsonwebtoken');
const {expressjwt:jWt} = require("express-jwt");
const bcrypt = require('bcrypt');
const Users = require("../models/Users");
require('cookie-parser');
require('dotenv').config();

exports.signup = async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        if(!(email && password)){
            res.status(400).send("All Inputs are required");
        }
        const oldUser = await Users.findOne({email});

        if(oldUser){
            return res.status(409).send("User Already exists. Please Login");
        }

        encryptedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({
            email, password : encryptedPassword
        });
        res.status(200).json(user);
    }catch (err) {
        res.status(400).json({
            error: "Please Enter Your email and password"
        });
    }
}

exports.singin = async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await Users.findOne({email});

        if(!user){
            res.status(404).json({Status:"Error", Error: 'Invalid Username/Password.'});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);

        if(passwordCompare){
            const token = jwt.sign(
                {
                    id:user._id,
                    email: user.email
                },
                process.env.JWT_SECRET,{
                    expiresIn: 86400
                }
            )
            return res.json({user, token:token});
        }else{
            return res.json({Status: "Error", Error: "Check the Password Again."})
        }

    }catch (err){
        console.log(err);
    }
}

exports.isSignedIn = jWt({ 
    secret:process.env.JWT_SECRET,
    userProperty:'auth',
    algorithms: ['HS256']
});