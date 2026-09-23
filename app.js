const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route - serve home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login page route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Mock database for authentication
const DEMO_USERS = [
  { email: 'admin@exampulse.com', password: 'password123', name: 'Dr. Sarah Jenkins', role: 'administrator' },
  { email: 'student@exampulse.com', password: 'password123', name: 'Alex Johnson', role: 'student' },
  { email: 'proctor@exampulse.com', password: 'password123', name: 'Marcus Vance', role: 'proctor' }
];

// Authentication API endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = DEMO_USERS.find(u => u.email === normalizedEmail);

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email address or password.'
    });
  }

  // Check role match if specified
  if (role && user.role !== role) {
    return res.status(403).json({
      success: false,
      message: `Account found, but role does not match selected role (${role.toUpperCase()}).`
    });
  }

  // Successful login response
  return res.status(200).json({
    success: true,
    message: 'Authentication successful! Redirecting...',
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: `demo-token-${Date.now()}`
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 - Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Exam Pulse server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
