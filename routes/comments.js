var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkauth');
const commentController = require('../controller/commentController');

router.get('/:postId', commentController.get_post_comments);

router.post('/:postId', checkAuth, commentController.post_comment);

module.exports = router;
