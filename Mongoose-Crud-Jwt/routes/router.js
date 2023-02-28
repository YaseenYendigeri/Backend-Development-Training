const express = require("express");
const router = express.Router();
const PostsController = require("../controllers/Posts");
const AuthController = require("../controllers/Auth");
const {isSignedIn} = require("../controllers/Auth");

router.get("/", (req, res)=>{
    res.send("Hello World");
});


// Get All Posts....
router.get('/posts', PostsController.getPost);
// Create a Post...
router.post('/posts/create', PostsController.createPost);
// Find a Single Post
router.get('/posts/:id', PostsController.findSinglePost);
// Update a Single Post...
router.put('/posts/updatePost', PostsController.updatePost);
// delete a Post...
router.delete('/posts/deletePost', PostsController.deletePost);


//////////////////////////////////////////////////////

// To Sign New User Up...
router.post('/signup', AuthController.signup);

// To sign New User in...

router.post('/signin', AuthController.singin);

// Authorization...

router.get("/testauthroute", isSignedIn, (req, res)=>{
    res.send("A Protected Route...");
    res.json(req.auth);
    next();
});


module.exports = router;