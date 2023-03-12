const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const sequelize = new Sequelize('yourDbName', 'yourUserName', 'yourPassword', {
  dialect: 'mysql',
  host: 'localhost',
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

User.hasMany(Task, { onDelete: 'cascade' });
Task.belongsTo(User);

sequelize.sync().then(()=>{
  console.log("Database Connected.....");
});

app.use(express.json());

// Get all users with their tasks
app.get('/users', async (req, res) => {
  const users = await User.findAll({
    include: [{ model: Task }],
  });
  res.json(users);
});

// Get a specific user with their tasks
app.get('/users/:id', async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
    include: [{ model: Task }],
  });
  res.json(user);
});

// Create a new user
app.post('/users', async (req, res) => {
  const { name } = req.body;
  const user = await User.create({ name });
  res.json(user);
});

// Create a new task for a specific user
app.post('/users/:id/tasks', async (req, res) => {
  const { title, description } = req.body;
  const task = await Task.create({
    title,
    description,
    UserId: req.params.id,
  });
  res.json(task);
});

// Update a specific user
app.put('/users/:id', async (req, res) => {
  const { name } = req.body;
  await User.update({ name }, { where: { id: req.params.id } });
  res.json({ message: 'User updated' });
});

// Update a specific task
app.put('/tasks/:id', async (req, res) => {
  const { title, description } = req.body;
  await Task.update({ title, description }, { where: { id: req.params.id } });
  res.json({ message: 'Task updated' });
});

// Delete a specific user and all their tasks
app.delete('/users/:id', async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.json({ message: 'User deleted' });
});

// Delete a specific task
app.delete('/tasks/:id', async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Task deleted' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});