const express = require('express');
const bodyParser = require('body-parser');
const {Sequelize, DataTypes} = require('sequelize');
require(dotenv).config();

const sequelize = new Sequelize(process.env.DbName, process.env.user, process.envp.assword, {
    dialect: 'mysql',
    host: 'localhost',
  });
  
  const Todo = sequelize.define('Todo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    completed: DataTypes.BOOLEAN,
  },{
    timestamps: false
  });
  const app = express();
  app.use(bodyParser.json());
  // Create a new todo
  app.post('/todos', async (req, res) => {
    try {
      const todo = await Todo.create(req.body);
      res.json(todo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Read all todos
  app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.findAll();
      res.json(todos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Read a specific todo
  app.get('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByPk(req.params.id);
      res.json(todo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Update a todo
  app.put('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByPk(req.params.id);
      if (todo) {
        const updatedTodo = await todo.update(req.body);
        res.json(updatedTodo);
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Delete a todo
  app.delete('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByPk(req.params.id);
      if (todo) {
        await todo.destroy();
        res.json({ message: 'Todo deleted' });
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });