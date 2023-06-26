const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.post_private_account = async (req, res, next) => {
  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const privateAccount = req.body;

    const updatedUser = await prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        isPrivate: privateAccount,
      },
    });

    if (!updatedUser)
      return res.status('500').json('There is a server related error');

    return res.json({ updatedUser });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  }
};


exports.set_online = async (req, res, next) => {
    try {
        if (!req.user) return res.status('401').json('Unauthorized');

        let updatedUser;

        if (req.user.alwaysOffline)  {
            updatedUser = await prisma.users.update({
                where: {
                    "id": req.user.id
                },
                data: {
                    "isOnline": false
                }
            })
        }else {
            updatedUser = await prisma.users.update({
                where: {
                    "id": req.user.id
                },
                data: {
                    "isOnline": true
                }
            })
        }

        if (!updatedUser)
            return res.status('500').json('There is a server related error');

        setTimeout(async () => {
             const offlineUser = await prisma.users.update({
                where: {
                    "id": req.user.id
                },
                data: {
                    "isOnline": false
                }
            })
        }, 18*1000)

        return res.json({ updatedUser });
    } catch (err) {
        console.log(err);
        res.status('500').json('There is a server related error');
    }
}

exports.patch_alwaysOffline = async (req, res, next) => {
    try {
        if (!req.user) return res.status('401').json('Unauthorized');

        const alwaysOffline = req.body.alwaysOffline;

        const updatedUser = await prisma.users.update({
            where: {
                "id": req.user.id
            },
            data: {
                "alwaysOffline": alwaysOffline
            }
        })

        if (!updatedUser)
            return res.status('500').json('There is a server related error');

        return res.json({ updatedUser });
    } catch (err) {
        console.log(err);
        res.status('500').json('There is a server related error');
    }
}