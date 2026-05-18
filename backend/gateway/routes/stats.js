const express = require('express');
const router = express.Router();

// TODO: proxy vers stats-service
router.get('/', (req, res) => res.json({ service: 'stats-service', status: 'connected' }));

module.exports = router;
