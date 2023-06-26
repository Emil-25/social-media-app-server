var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkauth');
const settingController = require('../controller/settingController');

router.patch(
  '/privateAccount',
  checkAuth,
  settingController.post_private_account
);

router.get('/setOnline', checkAuth, settingController.set_online);

router.patch('/alwaysOffline', settingController.patch_alwaysOffline);

module.exports = router;
