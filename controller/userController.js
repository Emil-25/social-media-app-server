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
        if (!user) {
            return res.status("404").json("Not Found")
        }
        
        function exclude(user, keys) {
            for (let key of keys) {
              delete user[key]
            }
            return user
        }

        const userWithoutPassword = exclude(user, ['password'])
        return res.json(userWithoutPassword)
    }
    catch(err) {
        console.log(err)
        res.status("500").json("There is a server related error")
    }
}

exports.patch_user_profile = async (req, res, next) => {
    const id = Number(req.param.id)

    await prisma.users.update({
        where: {
            "id": id
        },
        data: {
            
        }
    })
}

exports.me = (req, res, next) => {
    console.log(req.file)
    res.json(req.file)
}