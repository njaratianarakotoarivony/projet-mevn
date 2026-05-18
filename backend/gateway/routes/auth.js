const express = require('express');
const router = express.Router();

// TODO: proxy vers auth-service
router.get('/', (req, res) => res.json({ service: 'auth-service', status: 'connected' }));

module.exports = router;
