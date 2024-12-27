/**
 * Logout controller
 * Clears the JWT token from cookies and redirects to login page
 */

module.exports.logout = (req, res) => {
    // Clear the JWT token from cookies
    res.clearCookie('token');
    res.redirect("/login");
};
