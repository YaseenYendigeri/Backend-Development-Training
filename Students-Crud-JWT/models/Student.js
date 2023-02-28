const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    rollNo: Number,
    marks: Array
});

module.exports = mongoose.model('Student', studentSchema);