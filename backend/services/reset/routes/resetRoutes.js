const express = require('express');
const router = express.Router();
const { resetPassword, requestReset } = require('../controllers/resetController');

router.post('/reset-password', resetPassword);
router.post('/request-reset', requestReset);

module.exports = router;
