var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkauth');
const settingController = require('../controller/settingController');

router.patch(
  '/privateAccount',
  checkAuth,
  settingController.post_private_account
);

module.exports = router;
