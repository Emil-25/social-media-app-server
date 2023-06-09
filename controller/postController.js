const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.get_post = (req, res, next) => {
    const postId = Number(req.params.postId);

    try {
        const post = await prisma.posts.findUnique({
            where: {
                "id": postId
            }
        })
        if (!post) {
            return res.status("404").json("Post Not Found")
        }

        return res.json(post)
    }
    catch(err) {
        console.log(err)
        res.status("500").json("There is a server related error")
    }
}

exports.get_all_posts = (req, res, next) => {
    try {
        const posts = await prisma.users.findMany({
            where: {
                "isPrivate": false
            }
        }).posts();

        if (!posts) return res.status("404").json("No posts")

        return res.json(posts)

    } catch (err) {
        console.log(err)
        res.status("500").json("There is a server related error")
    }
}

exports.get_following_posts = (req, res, next) => {
    if (!req.user) return res.status("401").json("Unauthorized")

    try {
        
        const followingIds = await prisma.users.findUnique({
            where: {
                "id": req.user.id
            },
            select: {
                "followingIds": true
            }
        })

        

        const posts = await prisma.users.findMany({
            where: {
                "isPrivate": false
            }
        }).posts();

        if (!posts) return res.status("404").json("No posts")

        return res.json(posts)

    } catch (err) {
        console.log(err)
        res.status("500").json("There is a server related error")
    }
}