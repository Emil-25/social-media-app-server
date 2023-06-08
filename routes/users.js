const { profileUpload } = require('../config/multer.config')
var express = require('express');
var router = express.Router();
const userController = require('../controller/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json('respond with a resource');
});

router.get('/', function(req, res, next) {
    res.json("haha")
});

// router.post('/me', profileUpload.single('avatar'), userController.me)
router.post('/me', profileUpload.single('avatar'), userController.me)

router.get('/:id',  userController.get_user);



module.exports = router;
