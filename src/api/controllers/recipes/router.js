const express = require('express');
const rescue = require('express-rescue');

const {
  create,
  getAll,
  findById,
} = require('.');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', rescue(auth), rescue(create));

router.get('/', rescue(getAll));

router.get('/:id', rescue(findById));

module.exports = router;
