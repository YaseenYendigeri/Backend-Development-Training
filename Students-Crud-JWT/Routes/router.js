const express = require("express");
const studentsController = require("../controllers/students");
const studentAuthorization = require("../controllers/StudAuth");
const {isSignedIn} = require("../controllers/StudAuth");
const {getAllAuth} = require("../controllers/students");
const router = express.Router();

router.get("/", (req, res)=>{
    res.send("Hello World");
});

////// CRUD //////

router.get("/students", studentsController.getAll);

router.post("/students/add", studentsController.createStudentData);

router.get("/students/:id", studentsController.getSingleStudent);

router.put("/students/update/:id", studentsController.updateStudent);

router.delete("/students/delete/:id", studentsController.deleteStudent);

///// Authentication and Authorization....

router.post("/signup", studentAuthorization.signup);

router.post("/signin", studentAuthorization.signIn);

router.get('/isSignedIN', isSignedIn, getAllAuth);


module.exports = router;