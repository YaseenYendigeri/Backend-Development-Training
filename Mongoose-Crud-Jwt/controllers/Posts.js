const Posts = require("../models/Post");
exports.createPost = async(req, res) => {
    const post = new Posts({title: req.body.title,
    description:req.body.description
    });
    try{
        const postsave = await post.save();
        res.send(postsave);
    }catch (error){
        console.log(error);
    }
}

exports.getPost = async(req, res) => {
    try{
        const posts = await Posts.find()

        res.json(posts);
    }catch (error){
        res.send("Error", error);
    }
}

exports.findSinglePost = async(req, res) => {
    try{
        const posts = await Posts.findById(req.params.id);
        res.send(posts);
    }catch (err){
        res.send(err);
    }
}

exports.updatePost = async(req, res)=> {
    const postsUpdate = await Posts.findByIdAndUpdate(req.params.id, req.body, {new:true});
    res.json(postsUpdate);
}


exports.deletePost = async(req, res) =>{
    try{
    const postdelete = await Posts.findById(req.params.id);
    res.json(postdelete);
    }catch (err){
        res.send(err);
    } 
}