const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPassword');

// Forgot password page
router.get("/", forgotPasswordController.getForgotPasswordPage);

// Handle forgot password form submission
router.post("/", forgotPasswordController.handleForgotPassword);

// Reset password page
router.get("/reset-password", forgotPasswordController.getResetPasswordPage);

// Handle reset password form submission
router.post("/reset-password", forgotPasswordController.handleResetPassword);

module.exports = router;
