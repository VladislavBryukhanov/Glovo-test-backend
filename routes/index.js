const express = require('express');
const router = express.Router();
const { estimateOrder } = require('../services');

router.post('/estimate-order', estimateOrder);

module.exports = router;
