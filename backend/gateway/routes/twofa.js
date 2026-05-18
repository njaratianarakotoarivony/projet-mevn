const express = require('express');
const router = express.Router();

// TODO: proxy vers twofa-service
router.get('/', (req, res) => res.json({ service: 'twofa-service', status: 'connected' }));

module.exports = router;
