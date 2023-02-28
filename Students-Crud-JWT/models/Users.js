const mongoose = require("mongoose");

const studAuthSchema = mongoose.Schema({
    usn:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    token: {type:String}

});

module.exports = mongoose.model('User', studAuthSchema);