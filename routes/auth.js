var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkauth');
const authController = require('../controller/authController');

router.post(
  '/signup',
  authController.sign_up_validation(),
  authController.handle_sign_up_validation,
  authController.sign_up_user
);

router.post(
  '/login',
  authController.log_in_validation(),
  authController.handle_log_in_validation,
  authController.log_in_user
);

router.post('/login/google', authController.log_in_google_user);

router.post('/signup/google', authController.sign_up_google_user);

router.get('/me', checkAuth, authController.get_me);

module.exports = router;
