const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_very_secret_key';

class JwtUtil {
    /**
     * Decode a JWT token without verification
     * @param {string} token - JWT token to decode
     * @returns {object} Decoded token payload
     */
    static decode(token) {
        return jwt.decode(token);
    }

    /**
     * Verify a JWT token
     * @param {string} token - JWT token to verify
     * @returns {object} Decoded token payload if valid
     * @throws {Error} If token is invalid or expired
     */
    static verify(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token has expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            }
            throw error;
        }
    }

    /**
     * Generate a new JWT token
     * @param {object} payload - Data to be encoded in the token
     * @param {string} expiresIn - Token expiration time
     * @returns {string} Generated JWT token
     */
    static generate(payload, expiresIn = '24h') {
        return jwt.sign(payload, JWT_SECRET, { expiresIn });
    }

    /**
     * Generate a new JWT token for password reset
     * @param {string} email - Email address for password reset
     * @returns {string} Generated JWT token
     */
    static generatePasswordResetToken(email) {
        return this.generate({ email }, '1h');
    }

    /**
     * Check if a token is about to expire
     * @param {string} token - JWT token to check
     * @param {number} thresholdSeconds - Seconds before expiration to consider token near expiry
     * @returns {boolean} True if token is near expiration
     */
    static isNearExpiry(token, thresholdSeconds = 300) {
        const decoded = this.decode(token);
        if (!decoded) return false;

        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp - currentTime <= thresholdSeconds;
    }

    /**
     * Extract user ID from token
     * @param {string} token - JWT token
     * @returns {string|null} User ID or null if not found
     */
    static getUserId(token) {
        const decoded = this.decode(token);
        return decoded ? decoded.userId : null;
    }
}

module.exports = JwtUtil;
