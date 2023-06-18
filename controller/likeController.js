const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.add_post_like = async (req, res, next) => {
    const postId = Number(req.params.postId);

    try {
        if (!req.user) return res.status('401').json('Unauthorized');

        const updatedPost = await prisma.posts.update({
            where: {
                "id": postId
            },
            data: {
                "numberOfLikes": {
                    increment: 1
                }
            }
        })

        if (!updatedPost) return res.status('500').json('There is a server related error');  

        return res.status("201").json({updatedPost})

    } catch (err) {
        console.log(err);
        res.status('500').json('There is a server related error');
    }
}

exports.remove_post_like = async (req, res, next) => {
    const postId = Number(req.params.postId);

    try {
        if (!req.user) return res.status('401').json('Unauthorized');

        const updatedPost = await prisma.posts.update({
            where: {
                "id": postId
            },
            data: {
                "numberOfLikes": {
                    increment: -1
                }
            }
        })

        if (!updatedPost) return res.status('500').json('There is a server related error');  

        return res.status("201").json({updatedPost})

    } catch (err) {
        console.log(err);
        res.status('500').json('There is a server related error');
    }
}

exports.add_comment_like = async (req, res, next) => {
    const commentId = Number(req.params.commentId);

    try {
        if (!req.user) return res.status('401').json('Unauthorized');

        const updatedComment = await prisma.comments.update({
            where: {
                "id": commentId
            },
            data: {
                "numberOfLikes": {
                    increment: 1
                }
            }
        })

        if (!updatedComment) return res.status('500').json('There is a server related error');  

        return res.status("201").json({updatedComment})

    } catch (err) {
        console.log(err);
        res.status('500').json('There is a server related error');
    }
}

exports.remove_comment_like = async (req, res, next) => {
    const commentId = Number(req.params.commentId);

    try {
        if (!req.user) return res.status('401').json('Unauthorized');

        const updatedComment = await prisma.comments.update({
            where: {
                "id": commentId
            },
            data: {
                "numberOfLikes": {
                    increment: -1
                }
            }
        })

        if (!updatedComment) return res.status('500').json('There is a server related error');  

        return res.status("201").json({updatedComment})

    } catch (err) {
        console.log(err);
        res.status('500').json('There is a server related error');
    }
}


