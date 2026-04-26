const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/blog_era')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

// Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

// Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ name, email, password, role });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey123', { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user._id, name, email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey123', { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    
    const decoded = jwt.verify(token, 'secretkey123');
    const user = await User.findById(decoded.id).select('-password');
    
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Test route
app.get('/api/blogs', (req, res) => {
  res.json([]);
});

// Create default admin user
async function createDefaultUsers() {
  const adminExists = await User.findOne({ email: 'admin@blogera.com' });
  if (!adminExists) {
    const admin = new User({
      name: 'Admin User',
      email: 'admin@blogera.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin created: admin@blogera.com / admin123');
  }
  
  const bloggerExists = await User.findOne({ email: 'blogger@blogera.com' });
  if (!bloggerExists) {
    const blogger = new User({
      name: 'Blogger User',
      email: 'blogger@blogera.com',
      password: 'blogger123',
      role: 'blogger'
    });
    await blogger.save();
    console.log('✅ Blogger created: blogger@blogera.com / blogger123');
  }
  
  const userExists = await User.findOne({ email: 'user@blogera.com' });
  if (!userExists) {
    const user = new User({
      name: 'Regular User',
      email: 'user@blogera.com',
      password: 'user123',
      role: 'user'
    });
    await user.save();
    console.log('✅ User created: user@blogera.com / user123');
  }
}

// Start server
const PORT = 5003;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await createDefaultUsers();
});