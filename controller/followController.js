const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

exports.get_my_followers = async (req, res, next) => {
    try {
        if (!req.user) return res.status("401").json("Unauthorized");
        
        const followers = await prisma.followerfollowings.findMany({
            where: {
                "followingId": req.user.id
            },
            select: {
                "followerId": true
            }
        })

        if (!followers) return res.status("404").json("No followers")

        const followerIds = followers.map(follower => follower.followingId);

        const followerUsers = await prisma.users.findMany({
            where: {
                "id": {in: followerIds}
            }
        })

        res.json(followerUsers)

    } catch (err) {
        console.log(err)
        return res.status("500").json("There is a server related error")
    }
}