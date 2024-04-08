const express = require('express');
const movingAverageController = require('./movingAverageController');
const movingAverageValidator = require('./movingAverageValidator');
const router = express.Router();

router.post('/', movingAverageValidator, movingAverageController);

module.exports = router;