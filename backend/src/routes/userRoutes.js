const express = require('express');
const { signup, login } = require('../controllers/userController');
const { userSignupValidation, userLoginValidation } = require('../validators/userValidator');
const {validate} = require("../middleware/validationMiddleware");

const router = express.Router();

// Routes
router.post('/signup', validate(userSignupValidation), signup);
router.post('/login', validate(userLoginValidation), login);

module.exports = router;