const express = require('express');
const rescue = require('express-rescue');

const { create, createAdmin } = require('.');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', rescue(create));

router.post('/admin', rescue(auth), rescue(createAdmin));

module.exports = router;
