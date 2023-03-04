const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

const fileStorage = multer.diskStorage({
    destination:"uploads",
    filename: (req, file, cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});

const uploadImage = multer({
    storage:fileStorage,
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Please Upload An Image file!!!'));
        }
        cb(undefined, true);
    }
});

app.post("/uploadImage", uploadImage.single('image') ,(req, res)=>{
    res.send(req.file);
}, (error, req, res, next)=>{
    res.status(400).send({error:error.message});
});

app.post("/uploadMultipleImages", uploadImage.array('images', 3), (req, res)=>{
    res.send(req.files);

},(err, req, res, next)=>{
    res.status(400).send({error:error.message});
});


app.get("/getImages", (req, res)=>{

});

app.get("/", (req, res)=>{
    res.send("<h1>Hello World</h1>");
});


app.listen(3000, ()=>{
    console.log("Servers Running on Port 3000.....");
});