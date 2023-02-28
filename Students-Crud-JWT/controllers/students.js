const Students = require('../models/Student');
const bodyParser = require('body-parser');


exports.createStudentData = async(req, res)=>{
    const student = new Students({
        name:req.body.name,
        rollNo:req.body.rollNo,
        marks:req.body.marks
    });

    try{
        const saveStud = await student.save();
        res.json(saveStud);

    }catch(err){
        console.log(err);
    }
}

exports.getAllAuth = async(req, res)=>{
    try{
        const studs = await Students.find();
        res.send(studs);
    }catch(err){
        console.log(err);
    }
}

exports.getAll = async(req, res)=>{
    try{
        const studs = await Students.find().select('name rollNo');
        res.send(studs);
    }catch(err){
        console.log(err);
    }
}

exports.getSingleStudent = async(req, res)=>{
    try{
        const singleStud = await Students.findById(req.params.id);
        if(!singleStud){
            res.status(404).send("Not Found..");
        }else{
        res.send(singleStud).select('name rollNo');
        }
    }catch(err){
        console.log(err);
    }
}

exports.updateStudent = async(req, res)=>{
    try{
        const upStuds = await Students.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.send(upStuds).select('name rollNo');
    }catch(err){
        console.log(err);
    }
}

exports.deleteStudent = async(req, res)=>{
    try{
        const delStud = await Students.findById(req.params.id);
        res.send("Deleted SucessFully");
    }catch(err){
        console.log(err);
    }
}