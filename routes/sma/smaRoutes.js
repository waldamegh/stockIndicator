const express = require('express');
const smaCalc = require('./smaController');
const smaService = require('./smaService');
const router = express.Router();

router.get('/', smaCalc);

module.exports = router;