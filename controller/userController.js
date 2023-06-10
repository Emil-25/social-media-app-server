const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function exclude(user, keys) {
    for (let key of keys) {
      delete user[key]
    }
    return user
}

exports.get_user = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const user = await prisma.users.findUnique({
            where: {
                "id": id
            }
        })
        if (!user) {
            return res.status("404").json("User Not Found")
        }

        const userWithoutPassword = exclude(user, ['password'])
        return res.json(userWithoutPassword)
    }
    catch(err) {
        console.log(err)
        res.status("500").json("There is a server related error")
    }
}

exports.get_all_users = async (req, res, next) => {
    try {
        const users = await prisma.users.findMany();
        
        if (!users) {
            return res.status("404").json("No User Found")
        }

        return res.json(users)
    }
    catch(err) {
        console.log(err)
        res.status("500").json("There is a server related error")
    }
}

exports.patch_my_profile = async (req, res, next) => {
    try {
        if (!req.user) return res.status("401").json("Unauthorized");

        const { fullName, interests, bio } = req.body;
        const avatar = req.file.path;

        if(!fullName) return res.status("400").json("Fullname is required")

        const updatedUser = await prisma.users.update({
            where: {
                "id": req.user.id
            },
            data: {
                "fullName": fullName,
                "interests": interests,
                "bio": bio,
                "avatar": avatar
            }
        })

        if(!updatedUser) return res.status("401").json("User couldn't found")

        const userWithoutPassword = exclude(updatedUser, ['password'])
        return res.status("201").json(userWithoutPassword)

    } catch (err) {
        console.log(err)
        return res.status("500").json("There is a server related error")
    }
}

exports.delete_my_profile = async (req, res, next) => {
    try {
        if (!req.user) return res.status("401").json("Unauthorized");

        const deletedUser = await prisma.users.delete({
            where: {
                "id": req.user.id
            }
        })

        if (!deletedUser) res.status("401").json("User couldn't found")

        return res.json("User Deleted")

    } catch (err) {
        console.log(err)
        return res.status("500").json("There is a server related error")
    }
}

exports.test = async (req, res, next) => {
    console.log(req.file)
    res.json(req.file)
}