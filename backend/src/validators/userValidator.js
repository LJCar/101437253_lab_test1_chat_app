const { body } = require('express-validator');

const userSignupValidation = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const userLoginValidation = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { userSignupValidation, userLoginValidation };