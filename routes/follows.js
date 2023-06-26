var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkauth');
const followController = require('../controller/followController');

router.get('/followings/me', checkAuth, followController.get_my_followings);

router.get('/followings/:followingId', checkAuth, followController.get_my_followers);

router.get('/followers/me', checkAuth, followController.get_my_followers);


router.post(
  '/followings/me/add/:followingId',
  checkAuth,
  followController.add_my_following
);

router.delete(
  '/followers/me/delete/:followerId',
  checkAuth,
  followController.delete_my_follower
);

router.delete(
  '/followings/me/delete/:followingId',
  checkAuth,
  followController.delete_my_following
);

router.get('/followers/:followerId', followController.get_user_followers);

router.get('/followings/:followingId', followController.get_user_followers);

router.get('/isMyFollowing/:followingId', checkAuth, followController.is_my_following)

module.exports = router;
