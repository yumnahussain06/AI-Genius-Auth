require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());          
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());           

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'AI-Genius Auth API is running.',
    version: '1.0.0',
    endpoints: {
      auth: {
        login:   'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        logout:  'POST /api/auth/logout',
      },
      ai: {
        freeModel:    'GET    /api/ai/free-model',
        premiumModel: 'POST   /api/ai/premium-model',
        purgeCache:   'DELETE /api/ai/purge-cache',
      },
    },
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 AI-Genius Auth API running on port ${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health Check: http://localhost:${PORT}/\n`);
  console.log('📋 Test Credentials:');
  console.log('   admin@ai-genius.com    / Admin@123   (Admin)');
  console.log('   premium@ai-genius.com  / Premium@123 (Premium_User)');
  console.log('   free@ai-genius.com     / Free@123    (Free_User)\n');
});

module.exports = app;