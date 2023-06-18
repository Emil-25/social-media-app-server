const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.post_private_account = async (req, res, next) => {
    try {
        if (!req.user) return res.status('401').json('Unauthorized');
        
        const privateAccount = req.body;

        const updatedUser = await prisma.users.update({
            where: {
                "id": req.user.id
            },
            data: {
                "isPrivate": privateAccount
            }
        })

        if (!updatedUser) return res.status('500').json('There is a server related error'); 

        return res.json({updatedUser})


    } catch (err) {
        console.log(err);
        res.status('500').json('There is a server related error');
    }
}