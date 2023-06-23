const { body, validationResult } = require('express-validator');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

exports.sign_up_validation = () => {
  return [
    body('fullName')
      .isLength({ min: 3 })
      .withMessage('Fullname must be at least 3 chars long')
      .isLength({ max: 30 })
      .withMessage('Fullname must be less than 30 chars long')
      .exists()
      .withMessage('Fullname is required')
      .trim()
      .matches(/^$|^[a-zA-ZčČćĆđĐšŠžŽ-]+ [a-zA-ZčČćĆđĐšŠžŽ-]+$/)
      .withMessage('Fullname should be consist of both your Name and Surname')
      .escape(),

    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid Email')
      .custom(async (value) => {
        const existingUser = await prisma.users.findUnique({
          where: {
            email: value,
          },
        });

        if (existingUser) {
          throw Error();
        }

        return true;
      })
      .withMessage('Email already in use')
      .exists()
      .withMessage('Email is required'),

    body('password')
      .isLength({ min: 7 })
      .withMessage('Password must be at least 7 chars long')
      .isLength({ max: 30 })
      .withMessage('Password must be at max 30 chars long')
      .exists()
      .withMessage('Password is required'),

    body('cpassword')
      .custom((value, { req }) => {
        if (value === req.body.password) return true;
        throw Error();
      })
      .withMessage('Confirmed password is not same as password')
      .exists()
      .withMessage('Confirmed password is required'),

    body('agree')
      .custom((value) => {
        if (value) return true;
        throw Error();
      })
      .withMessage('Accept the Terms and Conditions'),
  ];
};

exports.handle_sign_up_validation = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const formattedResult = result.formatWith((error) => error.msg);
    const errors = formattedResult.array();

    return res.status(400).json({ errors });
  }
  return next();
};

exports.sign_up_user = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        fullName: fullName,
        email: email,
        password: hashedPassword,
      },
    });

    const follow = await prisma.follows.create({
      data: {
        followerId: user.id,
        followingId: user.id,
      },
    });

    if (!user || !follow)
      return res.status('500').json('There is a server related error');

    const token = JWT.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '10d',
      }
    );

    return res.status('201').json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status('500').json('There is a server related error');
  }
};

exports.log_in_validation = () => {
  return [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid Email')
      .exists()
      .withMessage('Email is required'),

    body('password').exists().withMessage('Password is required'),
  ];
};

exports.handle_log_in_validation = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const formattedResult = result.formatWith((error) => error.msg);
    const errors = formattedResult.array();

    return res.status(400).json({ errors });
  }
  return next();
};

exports.log_in_user = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status('401')
        .json(
          "Invalid credentials. Please check your email and password combination or sign up if you don't have an account."
        );
    }

    const hashedPassword = user.password;

    const isSame = await bcrypt.compare(password, hashedPassword);

    if (!isSame) {
      return res
        .status('401')
        .json(
          "Invalid credentials. Please check your email and password combination or sign up if you don't have an account."
        );
    }

    const token = JWT.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '10d',
      }
    );

    return res.json({
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  }
};

exports.get_me = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await prisma.users.findUnique({
        where: {
          id: req.user.id,
        },
      });

      if (!user) {
        return res.status(401).json('Unauthorized');
      }

      function exclude(user, keys) {
        for (let key of keys) {
          delete user[key];
        }
        return user;
      }

      const userWithoutPassword = exclude(user, ['password']);
      return res.status('200').json({ userWithoutPassword });
    } else {
      return res.status('401').json('Unauthorized');
    }
  } catch (err) {
    console.log(err);
    res.status('500').json('There is a server related error');
  }
};
