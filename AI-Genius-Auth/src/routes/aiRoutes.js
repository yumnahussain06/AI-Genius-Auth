const express = require('express');
const { getFreeModel, postPremiumModel, purgeCache } = require('../controllers/aiController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/free-model', getFreeModel);

router.post('/premium-model', restrictTo('Premium_User', 'Admin'), postPremiumModel);

router.delete('/purge-cache', restrictTo('Admin'), purgeCache);

module.exports = router;