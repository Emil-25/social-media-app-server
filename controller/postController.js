const fs = require('fs');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.get_user_post = async (req, res, next) => {
  const postId = Number(req.params.postId);

  try {
    const post = await prisma.posts.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status('404').json('Post Not Found');
    }

    return res.json(post);
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  }
};

exports.get_all_posts = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      where: {
        isPrivate: false,
      },
      select: {
        id: true,
      },
    });

    if (!users) return res.status('404').json('No users');

    const userIds = users.map((user) => user.id);

    const posts = await prisma.posts.findMany({
      // Repeated func
      where: {
        id: { in: userIds },
      },
    });

    if (!posts) return res.status('404').json('No posts');

    return res.json(posts);
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  }
};

exports.get_following_posts = async (req, res, next) => {
  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const followings = await prisma.followerfollowings.findMany({
      where: {
        followerId: req.user.id,
      },
      select: {
        followingId: true,
      },
    });

    if (!followings) return res.status('404').json('No followings');

    const followingIds = followings.map((following) => following.followingId);

    const posts = await prisma.posts.findMany({
      // Repeated func
      where: {
        userId: { in: followingIds },
      },
    });

    if (!posts) return res.status('404').json('No posts');

    return res.json(posts);
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  }
};

exports.post_post = async (req, res, next) => {
  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const { title, description } = req.body;

    const url = req.file.path;

    if (!title && !url)
      return res.status('400').json('Title and File is required');

    if (!description) description = '';

    const post = await prisma.posts.create({
      data: {
        url: url,
        title: title,
        description: description,
      },
    });

    if (!post) return res.status('500').json('There is a server related error'); 

    const updatedUser = await prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        postIds: {
          push: post.id,
        },
      },
    });

    if (!updatedUser) return res.status('500').json('There is a server related error'); 

    return res.status("201").json(post);

  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  }
};

exports.delete_post = async (req, res, next) => {
  const postId = Number(req.params.postId);
  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const deletedPost = await prisma.posts.delete({
      where: {
        id: postId,
      },
    });

    if (!updatedUser) return res.status('500').json('There is a server related error'); 

    const filePath = deletedPost.url;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status('500').json('There is a server related error');
      }

      console.log('File deleted successfully');
    });

    return res.json('Post deleted');
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  }
};
