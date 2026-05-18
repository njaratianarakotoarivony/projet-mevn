const express = require('express');
const router = express.Router();

// TODO: proxy vers payments-service
router.get('/', (req, res) => res.json({ service: 'payments-service', status: 'connected' }));

module.exports = router;
