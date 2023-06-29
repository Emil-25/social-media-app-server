const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.get_post_comments = async (req, res, next) => {
  const postId = Number(req.params.postId);

  try {
    const comments = await prisma.posts
      .findUnique({
        where: {
          id: postId,
        },
      })
      .comments();

    if (!comments) {
      return res.status('404').json('Post Not Found');
    }

    return res.json({ comments });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};

exports.post_comment = async (req, res, next) => {
  const postId = Number(req.params.postId);

  try {
    if (!req.user) return res.status('401').json('Unauthorized');
    const comment = req.body.comment;

    if (!comment) return res.status('400').json('Comment is required');

    const createdComment = await prisma.comments.create({
      data: {
        comment: comment,
        postId: postId,
        userId: req.user.id,
      },
    });

    if (!createdComment) {
      return res.status('500').json('There is a server related error');
    }

    const updatedPost = await prisma.posts.update({
      where: {
        id: postId,
      },
      data: {
        commentIds: {
          push: createdComment.id,
        },
      },
    });

    return res.json({ createdComment });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};
