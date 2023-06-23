const { contentUpload } = require('../config/multer.config');
var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkauth');
const postController = require('../controller/postController');

router.get('/', postController.get_all_posts);

router.post(
  '/',
  checkAuth,
  contentUpload.single('url'),
  postController.post_post
);

router.get('/followings', checkAuth, postController.get_following_posts);

router.get('/:postId', postController.get_user_post);

router.delete('/:postId', checkAuth, postController.delete_post);

module.exports = router;
