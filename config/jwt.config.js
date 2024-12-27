/**
 * JWT Configuration
 * Contains JWT settings and secrets
 */

module.exports = {
    // Secret key for signing JWT tokens - in production, use a strong secret and store in environment variables
    JWT_SECRET: 'your-strong-secret-key-here',
    
    // Token expiration time
    JWT_EXPIRES_IN: '24h',
    
    // Cookie options for storing JWT
    COOKIE_OPTIONS: {
        httpOnly: true,          // Prevents JavaScript access to the cookie
        secure: false,           // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000,  // 24 hours in milliseconds
        sameSite: 'strict'      // Protection against CSRF
    }
};
