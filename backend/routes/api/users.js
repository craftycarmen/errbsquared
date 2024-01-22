const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError, ValidationErrorItem } = require('sequelize');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email')
        .bail()
        .custom(async (value, { req }) => {
            const user = await User.unscoped().findOne({
                where: {
                    email: value
                }
            });

            if (user) {
                throw new Error('Email already exists')
            }
        }),
    check('username')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Username is required')
        .bail()
        .isLength({ min: 4 })
        .withMessage('Username must be 4 characters or more')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email')
        .bail()
        .custom(async (value, { req }) => {
            const user = await User.findOne({
                where: {
                    username: value
                }
            })

            if (user) {
                throw new Error('Username already exists')
            }
        }),
    check('firstName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more'),
    handleValidationErrors
];

router.post('/', validateSignup, async (req, res) => {
    try {
        const { email, password, username, firstName, lastName } = req.body;
        const hashedPassword = bcrypt.hashSync(password);

        const user = await User.create({ email, username, hashedPassword, firstName, lastName });

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        }

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        })
    } catch (err) {
        let path = err.errors[0].path;
        let errObj = {}
        errObj[path] = err.message;

        // return res.status(500).json({
        //     message: 'User already exists',
        //     errors: errObj
        // });

        new Error('Invalid username');
        err.status = 500;
        err.errors = { username: 'Username already exists' };
        return next(err);
    }

});

module.exports = router;
