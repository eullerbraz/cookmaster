const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, path.resolve(__dirname, '../../uploads/'));
  },
  filename: (req, _file, callback) => {
    const { id } = req.params;
    callback(null, `${id}.jpeg`);
  },
});

module.exports = multer({ storage }).single('image');
