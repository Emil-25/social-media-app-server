const { PrismaClient } = require('@prisma/client');
const { isImage, isVideo } = require('../utils/checkFileTypes');

const prisma = new PrismaClient();

function exclude(user, keys) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

exports.get_user = async (req, res, next) => {
  const id = Number(req.params.id);

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status('404').json('User Not Found');
    }

    const userWithoutPassword = exclude(user, ['password']);
    return res.json({ userWithoutPassword });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};

exports.get_all_users = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany();

    if (!users) {
      return res.status('404').json('No User Found');
    }

    return res.json({ users });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};

exports.patch_my_profile = async (req, res, next) => {
  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const { fullName, interests, bio } = req.body;

    if (!fullName) return res.status('400').json('Fullname is required');

    let updatedUser;

    if (req.file) {
      if (!isImage(req.file.filename)) {
        const filePath = req.file.path;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return res.status('400').json('Only Image file is allowed!');
          }

          console.log('File deleted successfully');
        });

        return res.status('400').json('Only Image file is allowed!');
      }
      const avatar = req.file.path;

      updatedUser = await prisma.users.update({
        where: {
          id: req.user.id,
        },
        data: {
          fullName: fullName,
          interests: interests,
          bio: bio,
          avatar: avatar,
        },
      });
    } else {
      updatedUser = await prisma.users.update({
        where: {
          id: req.user.id,
        },
        data: {
          fullName: fullName,
          interests: interests,
          bio: bio,
        },
      });
    }

    if (!updatedUser) return res.status('401').json("User couldn't found");

    const userWithoutPassword = exclude(updatedUser, ['password']);
    return res.status('201').json({ userWithoutPassword });
  } catch (err) {
    console.log(err);
    return res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};

exports.delete_my_profile = async (req, res, next) => {
  try {
    if (!req.user) return res.status('401').json('Unauthorized');

    const posts = await prisma.users.findMany({
      where: {
        userId: req.user.id,
      },
    });

    posts.map(async (post) => {
      const filePath = post.url;

      await fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status('500').json('There is a server related error');
        }

        console.log('File deleted successfully');
      });
    });

    const deletedUser = await prisma.users.delete({
      where: {
        id: req.user.id,
      },
    });

    if (!deletedUser) res.status('401').json("User couldn't found");

    return res.json('User Deleted');
  } catch (err) {
    console.log(err);
    return res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};

exports.find_user = async (req, res, next) => {
  try {
    const text = req.body.text;

    const users = await prisma.users.findMany({
      where: {
        fullName: {
          contains: text,
          mode: 'insensitive',
        },
      },
    });

    res.json({ users });
  } catch (err) {
    console.log(err);
    return res.status('500').json('There is a server related error');
  } finally {
    prisma.$disconnect();
  }
};
