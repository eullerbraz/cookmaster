const express = require('express');
const rescue = require('express-rescue');

const {
  create,
  getAll,
  findById,
  update,
  remove,
  addImage,
} = require('.');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');

const router = express.Router();

router.post('/', rescue(auth), rescue(create));

router.get('/', rescue(getAll));

router.get('/:id', rescue(findById));

router.put('/:id', rescue(auth), rescue(update));

router.delete('/:id', rescue(auth), rescue(remove));

router.put('/:id/image', rescue(auth), upload, rescue(addImage));

module.exports = router;
