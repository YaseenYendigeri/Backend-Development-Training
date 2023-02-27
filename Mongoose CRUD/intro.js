const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connecting to the DataBase....

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.7.1/todo-app', {useNewUrlParser:true});

// Defining the Schema....

const todoSchema = new mongoose.Schema({
    title : {type:String, required:true},
    description : String,
    completed : {type:Boolean, default: false}
});

// Creating Model....

const Todo = mongoose.model('Todo', todoSchema);


//set up body Parser middleware.....

app.use(bodyParser.json());

// Create a new Todo

app.post('/todos', (req, res)=>{
    if(!req.body.title){
        res.status(404).send({message:"Validation Error: Title Required But Not Found. Please Enter TITLE value and try again.... "})
    }
    const todo = new Todo({
        title: req.body.title,
        description : req.body.description,
        completed : req.body.completed
    });

    todo.save((err)=>{
        if(err){
            res.status(500).send('Error saving todo');

        }else{
            //res.send(todo);
            res.json({msg:"Record Stored Sucessfully", value: todo});
        }
    });
});

// Get all Todos.....

app.get('/todos', (req, res)=>{
    Todo.find((err, todos)=>{
        if(err){
            console.error(err);
            res.status(500).send('Error getting todo');
        }else{
            res.send(todos);
        }
    });
});


// Get a single Todo By ID.....

app.get('/todos/:id', (req, res)=>{
    Todo.findById(req.params.id, (err, todo)=>{
        if(err){
            console.error(err);
            res.status(500).send('Error finding the todo with '+ req.params.id);
        }else if(!todo){
            res.status(404).send('Todo with id: '+req.params.id+' Not Found..');

        }else{
            res.send(todo);
        }
    });
});

// Update a Todo by Id....

app.put('/todos/:id', (req, res)=>{
    Todo.findById(req.params.id, (err, todo)=>{
        if(err){
            console.error(err);
            res.status(500).send('Error finding the todo....');
        }else if(!todo){
            res.status(404).send('Todo Not Found...');
        }else{
            todo.title = req.params.title;
            todo.description = req.params.description;
            todo.completed = req.params.completed;

            todo.save((err)=>{
                if(err){
                    console.error(err);
                    res.status(500).send('Error while saving/Updating todo....');
                }else{
                    res.send(todo);
                }
            });
        }
    });
});

// Deleting a Todo by Id......

app.delete('/todos/:id', (req, res)=>{
    Todo.findByIdAndDelete(req.params.id, (err, todo)=>{
        if(err){
            console.error(err);
            res.status(500).send('Error finding the todo..');
        }else if(!todo){
            res.status(404).send('Todo Not Found...');
        }else{
            
            res.send(todo);
        }
    });
});


app.listen(3000, ()=>{
    console.log("App Running on Port 3000......");
});
