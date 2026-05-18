const express = require('express');
const router = express.Router();

// TODO: proxy vers rooms-service
router.get('/', (req, res) => res.json({ service: 'rooms-service', status: 'connected' }));

module.exports = router;
