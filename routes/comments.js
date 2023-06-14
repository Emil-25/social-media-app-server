var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkauth');
const commentController = require('../controller/commentController');

router.get('/comments/:postId', commentController.get_post_comments);

router.post('/comments/:postId', checkAuth, commentController.post_comment);

module.exports = router;