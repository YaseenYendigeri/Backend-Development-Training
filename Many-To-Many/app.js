const express = require("express");
const bodyParser = require("body-parser");
const {Sequelize,DataTypes} = require("sequelize"); 
require("dotenv").config();


const app = express();
app.use(bodyParser.json());
console.log(process.env.DBNAME, process.env.USER_NAME, process.env.PASSWORD);

const sequelize = new Sequelize(process.env.DBNAME, process.env.USER_NAME, process.env.PASSWORD,{
    dialect:'mysql',
    host:"localhost",
});

const User = sequelize.define('User', {
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
});

const Task = sequelize.define('Task',{
    title: {
        type:DataTypes.STRING,
        allowNull:false,
    },
});


// Define the Relations

User.belongsToMany(Task, {through:'UserTasks'});
Task.belongsToMany(User, {through:"UserTasks"});

// Sync The DataBase

sequelize.sync().then(()=>{
    console.log("Database Connected.....");
});


/// Creating a User...

app.post('/users', async(req, res)=>{
    const {name} = req.body;

    try{
        const user = await User.create({name});
        res.status(201).json(user);
    }catch(err){
        res.status(500).send("Erorr While Creating User");
    }
});


/// Creating Task.....

app.post("/tasks", async(req, res)=>{
    const {title} = req.body;

    try{
        const task = await Task.create({title});
        res.status(201).json(task); 
    }catch(err){
        res.status(500).send("Error While Creating task");
    }
});

/// Assign a Task to a User

app.post("/users/:userId/tasks/:taskId",  async(req, res)=>{
    const {userId, taskId} = req.params;

    try{
        const user = await User.findByPk(userId);
        const task = await Task.findByPk(taskId);
        if(!task){
            res.send("Error");
        }
        await user.addTask(task);
        res.status(200).json({msg:"Assigned SucessFully"})
    }catch(err){
        res.status(500).send("Error While Assigning Tasks to users....");
    }
});

/// Get all tasks Assgined to a user

app.get("/users/:userId/tasks", async(req, res)=>{
    const {userId} = req.params;

    try{
        const user = await User.findByPk(userId);
        const tasks = await user.getTasks();
        res.send(tasks);
    }catch(err){
        res.status(404).json({msg:"Error While Finding tasks...", error:err});
    }
});


/// Get all users for a task...

app.get('/tasks/taskId/users', async(req, res)=>{
    const {taskId} = req.params;
    
    try{
        const task = await Task.findByPk(taskId);
        const users = await task.getUsers();
        res.json(users);

    }catch(err){
        res.status(404).send("Users Not Found...")
    }
});


app.listen(3000,()=>{
    console.log("Listening on port 3000");
});