const express = require('express');
const smaCalc = require('./smaController');
const smaValidator = require('./smaValidator');
const router = express.Router();

router.post('/', smaValidator, smaCalc);

module.exports = router;