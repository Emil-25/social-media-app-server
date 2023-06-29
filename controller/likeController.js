const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.get_post_like = async (req, res, next) => {
  const postId = Number(req.params.postId);
  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const liked = await prisma.postLikes.findFirst({
      where: {
        userId: req.user.id,
        postId: postId,
      },
    });

    if (!liked) return res.json({ liked: false });

    return res.json({ liked: true });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};

exports.get_comment_like = async (req, res, next) => {
  const commentId = Number(req.params.commentId);

  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const liked = await prisma.commentLikes.findFirst({
      where: {
        userId: req.user.id,
        commentId: commentId,
      },
    });

    if (!liked) return res.json({ liked: false });

    return res.json({ liked: true });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};

exports.add_post_like = async (req, res, next) => {
  const postId = Number(req.params.postId);

  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const updatedPost = await prisma.posts.update({
      where: {
        id: postId,
      },
      data: {
        numberOfLikes: {
          increment: 1,
        },
      },
    });

    if (!updatedPost)
      return res.status('500').json('There is a server related error');

    const liked = await prisma.postLikes.create({
      data: {
        userId: req.user.id,
        postId: postId,
      },
    });

    if (!liked) return res.status(404).json('Not liked');

    return res.status('201').json({ updatedPost });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};

exports.remove_post_like = async (req, res, next) => {
  const postId = Number(req.params.postId);

  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const updatedPost = await prisma.posts.update({
      where: {
        id: postId,
      },
      data: {
        numberOfLikes: {
          increment: -1,
        },
      },
    });

    if (!updatedPost)
      return res.status('500').json('There is a server related error');

    const liked = await prisma.postLikes.findFirst({
      where: {
        userId: req.user.id,
        postId: postId,
      },
    });

    if (!liked) return res.status(404).json('Not liked');

    const deletedLike = await prisma.postLikes.delete({
      where: {
        id: liked.id,
      },
    });

    if (!deletedLike)
      return res.status('500').json('There is a server related error');

    return res.status('201').json({ updatedPost });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};

exports.add_comment_like = async (req, res, next) => {
  const commentId = Number(req.params.commentId);

  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const updatedComment = await prisma.comments.update({
      where: {
        id: commentId,
      },
      data: {
        numberOfLikes: {
          increment: 1,
        },
      },
    });

    if (!updatedComment)
      return res.status('500').json('There is a server related error');

    const liked = await prisma.commentLikes.create({
      data: {
        userId: req.user.id,
        commentId: commentId,
      },
    });

    if (!liked) return res.status(404).json('Not liked');

    return res.status('201').json({ updatedComment });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};

exports.remove_comment_like = async (req, res, next) => {
  const commentId = Number(req.params.commentId);

  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const updatedComment = await prisma.comments.update({
      where: {
        id: commentId,
      },
      data: {
        numberOfLikes: {
          increment: -1,
        },
      },
    });

    if (!updatedComment)
      return res.status('500').json('There is a server related error');

    const liked = await prisma.commentLikes.findFirst({
      where: {
        userId: req.user.id,
        commentId: commentId,
      },
    });

    if (!liked) return res.status(404).json('Not liked');

    const deletedLike = await prisma.commentLikes.delete({
      where: {
        id: liked.id,
      },
    });

    if (!deletedLike)
      return res.status('500').json('There is a server related error');

    return res.status('201').json({ updatedComment });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};
