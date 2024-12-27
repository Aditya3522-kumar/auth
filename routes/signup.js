const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signup');

// Signup page route
router.get("/", signupController.getSignupPage);

// Signup form submission
router.post("/", signupController.signup);

module.exports = router;