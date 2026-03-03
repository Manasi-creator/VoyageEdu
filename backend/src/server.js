const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const institutionRoutes = require('./routes/institutionRoutes');
const aisheRoutes = require('./routes/aisheRoutes');
const supportRoutes = require('./routes/supportRoutes');
const authRoutes = require('./routes/authRoutes');

// MongoDB connection string (from geocodeAndMigrate.js)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ramanvhantale_db_user:CK045D4mXeZYkKHA@cluster0.vyhwfbq.mongodb.net/?appName=Cluster0';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080', 
    'http://localhost:5173', 
    'http://127.0.0.1:8080',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true
}));

// Disable caching for API routes in development
app.use('/api', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'VoyageEdu Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      institutions: '/api/institutions',
      institutionById: '/api/institutions/:id'
    },
    documentation: 'Visit /health to check server status'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'VoyageEdu Backend API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/aishe', aisheRoutes);
app.use('/api', supportRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    
    // Start server after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api/institutions`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

module.exports = app;
