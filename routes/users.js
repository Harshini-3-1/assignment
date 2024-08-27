const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, phone, profession } = req.body;
  try {
    const user = new User({ name, email, password, phone, profession });
    await user.save();
    res.json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful!', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get All Users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update User
router.put('/:id', async (req, res) => {
  const { name, phone, profession } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name, phone, profession }, { new: true });
    res.json({ message: 'User updated successfully!', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
