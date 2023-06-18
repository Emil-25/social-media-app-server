const multer = require('multer');

const contentStorage = multer.diskStorage({
  destination: `./uploads/content/`,
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const profileStorage = multer.diskStorage({
  destination: `./uploads/profile/`,
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

exports.contentUpload = multer({ storage: contentStorage });
exports.profileUpload = multer({ storage: profileStorage });
