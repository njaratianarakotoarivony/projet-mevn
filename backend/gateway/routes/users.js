const express = require('express');
const router = express.Router();

// TODO: proxy vers users-service
router.get('/', (req, res) => res.json({ service: 'users-service', status: 'connected' }));

module.exports = router;
