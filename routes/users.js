var express = require('express');
var router = express.Router();
const userController = require('../controller/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
    console.log(req.body)
    res.send(req.body);
});

router.get('/:id', userController.get_user);



module.exports = router;
