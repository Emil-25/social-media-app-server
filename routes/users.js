const { profileUpload } = require('../config/multer.config')
var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkauth')
const userController = require('../controller/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json('respond with a resource');
});

router.post('/me', checkAuth, profileUpload.single('avatar'), userController.patch_my_profile)

router.post('/test', profileUpload.single('avatar') , userController.test)


module.exports = router;
