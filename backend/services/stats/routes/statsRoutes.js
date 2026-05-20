const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { verifyToken, checkAdmin } = require('../middlewares/statsMiddleware');

router.get('/', verifyToken, checkAdmin, getStats);

module.exports = router;
