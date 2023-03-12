const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Sequelize, DataTypes } = require('sequelize');

dotenv.config();

const app = express();

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error:', err));

// Define user model
const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Create user table if not exists
User.sync();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });
    res.json(user);
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

// Login user and return JWT token
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Verify JWT token
app.post('/verify', async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    console.log('Error:', err);
    res.status(401).json({ message: 'Invalid token.' });
  }
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
