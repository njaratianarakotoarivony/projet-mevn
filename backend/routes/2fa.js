const express = require('express');
const router = express.Router();
const { verify2FA } = require('../controllers/2faController');

router.post('/verify-2fa', verify2FA);

module.exports = router;
