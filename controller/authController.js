const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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
            .custom(async value => {
                const existingUser = await prisma.users.findUnique({
                    where: {
                        "email": value
                    }
                });

                if (existingUser) {
                    return false;;
                }
                return true
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
                .custom(value => {
                    if (value === body('password')) return true
                    return false
                })
                .withMessage('Confirmed password is not same as password')
                .exists()
                .withMessage('Confirmed password is required'),

            body('agree')
                .custom(value => {
                    if (value) return true
                    return false
                })
                .withMessage('Accept the Terms and Conditions')
    ]
}

exports.handle_sign_up_validation = (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const formattedResult = result.formatWith(error => error.msg);
        const errors = formattedResult.array();

        return res.status(400).json({ errors });
    }

    return next();
}

exports.sign_up_user = async (req, res, next) => {

    try {
        const {fullName, email, password} = req.body;

        const hashedPassword = await bcrypt(password, 10)

        const user = await prisma.users.create({
            data: {
                "fullName": fullName,
                "email": email,
                "password": hashedPassword
            }
        });

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.TOKEN_SECRET,
            {
                "expiresIn": "10d"
            }
        )

        res.status('201').json({
            user,
            token
        })


    } catch (error) {
        console.log(error)
    }
    
}