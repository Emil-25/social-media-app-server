const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.get_user_followers = async (req, res, next) => {
  const userId = Number(req.params.followerId);

  try {
    const followers = prisma.follows.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
      },
    });

    if (!followers) return res.status('404').json('No followers');

    const followerIds = followers.map((follower) => follower.followerId);

    const followerUsers = await prisma.users.findMany({
      where: {
        id: { in: followerIds },
      },
    });

    res.json({followerUsers});
  } catch (err) {
    console.log(err);
    return res.status('500').json('There is a server related error');
  }
};

exports.get_user_followings = async (req, res, next) => {
  const userId = Number(req.params.followingId);

  try {
    const followings = prisma.follows.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    if (!followings) return res.status('404').json('No followings');

    const followingIds = followings.map((following) => following.followingId);

    const followingUsers = await prisma.users.findMany({
      where: {
        id: { in: followingIds },
      },
    });

    res.json({followingUsers});
  } catch (err) {
    console.log(err);
    return res.status('500').json('There is a server related error');
  }
};

exports.get_my_followers = async (req, res, next) => {
  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const followers = await prisma.follows.findMany({
      where: {
        followingId: req.user.id,
      },
      select: {
        followerId: true,
      },
    });

    if (!followers) return res.status('404').json('No followers');

    const followerIds = followers.map((follower) => follower.followerId);

    const followerUsers = await prisma.users.findMany({
      where: {
        id: { in: followerIds },
      },
    });

    res.json({followerUsers});
  } catch (err) {
    console.log(err);
    return res.status('500').json('There is a server related error');
  }
};

exports.get_my_followings = async (req, res, next) => {
  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const followings = await prisma.follows.findMany({
      where: {
        followerId: req.user.id,
      },
      select: {
        followingId: true,
      },
    });

    if (!followings) return res.status('404').json('No followings');

    const followingIds = followings.map((following) => following.followingId);

    const followingUsers = await prisma.users.findMany({
      where: {
        id: { in: followingIds },
      },
    });

    res.json({followingUsers});
  } catch (err) {
    console.log(err);
    return res.status('500').json('There is a server related error');
  }
};

exports.add_my_following = async (req, res, next) => {
  const userId = Number(req.params.followingId);

  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const createdFollowingFollowers = await prisma.follows.create({
      data: {
        followerId: req.user.id,
        followingId: userId,
      },
    });
    if (!createdFollowingFollowers)
      return res.status('500').json('There is a server related error');

    return res.json('Added to followings!');
  } catch (err) {
    console.log(err);
    return res.status('500').json('There is a server related error');
  }
};

exports.delete_my_following = async (req, res, next) => {
  const userId = Number(req.params.followingId);

  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const deletedFollowingFollowers = await prisma.follows.delete({
      where: {
        followerId: req.user.id,
        followingId: userId,
      },
    });
    if (!deletedFollowingFollowers)
      return res.status('500').json('There is a server related error');

    return res.json('Deleted from followings!');
  } catch (err) {
    console.log(err);
    return res.status('500').json('There is a server related error');
  }
};

exports.delete_my_follower = async (req, res, next) => {
  const userId = Number(req.params.followerId);

  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const deletedFollowingFollowers = await prisma.follows.delete({
      where: {
        followerId: userId,
        followingId: req.user.id,
      },
    });
    if (!deletedFollowingFollowers)
      return res.status('500').json('There is a server related error');

    return res.json('Deleted from followers!');
  } catch (err) {
    console.log(err);
    return res.status('500').json('There is a server related error');
  }
};
