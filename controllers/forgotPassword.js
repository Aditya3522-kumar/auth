const User = require('../models/user');
const JwtUtil = require('../utils/jwt.util');
const NodemailerUtil = require('../utils/nodemailer.util');

module.exports.getForgotPasswordPage = (req, res) => {
    res.render('forgot-password.ejs');
};

module.exports.handleForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('No account with that email found.');
        }

        // Generate password reset token
        const resetToken = JwtUtil.generatePasswordResetToken(email);
        
        // Create reset link using base URL from environment variables
        const resetLink = `${process.env.BASE_URL}/forgot-password/reset-password?token=${resetToken}`;

        // Send reset email
        const emailSent = await NodemailerUtil.sendPasswordResetEmail(email, resetLink);
        
        if (emailSent) {
            res.send('Password reset link sent to your email.');
        } else {
            res.status(500).send('Error sending password reset email.');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).send('Server error');
    }
};

module.exports.getResetPasswordPage = (req, res) => {
    const { token } = req.query;
    
    // Verify token
    const decoded = JwtUtil.verify(token);
    if (!decoded) {
        return res.status(400).send('Invalid or expired reset token');
    }

    res.render('reset-password.ejs', { token });
};

module.exports.handleResetPassword = async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    // Validate passwords match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        // Verify token
        const decoded = JwtUtil.verify(token);
        if (!decoded) {
            return res.status(400).send('Invalid or expired reset token');
        }

        // Find user by email from token
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Hash new password
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        res.send('Password successfully reset. You can now login with your new password.');
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).send('Server error');
    }
};
