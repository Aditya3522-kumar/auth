/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

const jwt = require('jsonwebtoken');
const JwtUtil = require('../utils/jwt.util');
const { JWT_SECRET } = require('../config/jwt.config');

const verifyToken = (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        
        if (!token) {
            return res.redirect('/login');
        }

        // Verify token using JwtUtil
        const decoded = JwtUtil.verify(token);
        
        // Add user data to request object
        req.user = decoded;
        
        // Optional: Check if token is near expiry and refresh
        if (JwtUtil.isNearExpiry(token)) {
            const newToken = JwtUtil.generate(
                { userId: decoded.userId, email: decoded.email },
                '24h'
            );
            res.cookie('token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000
            });
        }
        
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.clearCookie('token');
        res.redirect('/login');
    }
};

module.exports = verifyToken;
