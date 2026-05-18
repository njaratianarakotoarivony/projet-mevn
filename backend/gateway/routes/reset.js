const express = require('express');
const router = express.Router();

// TODO: proxy vers reset-service
router.get('/', (req, res) => res.json({ service: 'reset-service', status: 'connected' }));

module.exports = router;
