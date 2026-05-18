const express = require('express');
const router = express.Router();

// TODO: proxy vers reservations-service
router.get('/', (req, res) => res.json({ service: 'reservations-service', status: 'connected' }));

module.exports = router;
