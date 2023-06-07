const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


exports.get_user = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const user = await prisma.users.findUnique({
            where: {
                "id": id
            }
        })
        res.send(user)

    }
    catch(err) {
        console.log(err)
        next(err)
    }
}

exports.patch_user_profile = async (req, res, next) => {
    res.send('after auth')
}