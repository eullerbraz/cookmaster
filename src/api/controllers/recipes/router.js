const express = require('express');
const rescue = require('express-rescue');

const { create } = require('.');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', rescue(auth), rescue(create));

module.exports = router;
