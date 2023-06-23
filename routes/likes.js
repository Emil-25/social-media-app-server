var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkauth');
const likeController = require('../controller/likeController');

router.get('/posts/:postId', checkAuth, likeController.get_post_like);

router.get('/posts/add/:postId', checkAuth, likeController.add_post_like);

router.get('/posts/remove/:postId', checkAuth, likeController.remove_post_like);

router.get('/comments/:commentId', checkAuth, likeController.get_comment_like);

router.get(
  '/comments/add/:commentId',
  checkAuth,
  likeController.add_comment_like
);

router.get(
  '/comments/remove/:commentId',
  checkAuth,
  likeController.remove_comment_like
);

module.exports = router;
