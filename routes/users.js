const { profileUpload } = require('../config/multer.config');
var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkauth');
const userController = require('../controller/userController');


router.get('/', userController.get_all_users);

router.patch('/me', checkAuth , profileUpload.single('avatar') ,userController.patch_my_profile);

router.delete('/me', checkAuth, userController.delete_my_profile);

router.get('/:id', userController.get_user);

module.exports = router;
