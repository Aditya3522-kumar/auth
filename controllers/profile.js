const User = require("../models/user");
const JwtUtil = require('../utils/jwt.util');

module.exports.getProfile = async (req, res) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        
        if (!token) {
            return res.redirect("/login");
        }

        // Verify and decode token
        const decoded = JwtUtil.verify(token);
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.redirect("/login");
        }

        // Check if the logged-in user matches the requested profile
        if (decoded.userId !== user._id.toString()) {
            return res.redirect("/login");
        }

        res.render("show.ejs", { user });
    } catch (err) {
        console.log(err);
        // If token is invalid or expired
        res.clearCookie('token');
        res.redirect("/login");
    }
};

module.exports.home = async (req, res) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        
        if (!token) {
            return res.redirect("/login");
        }

        // Verify and decode token
        const decoded = JwtUtil.verify(token);
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.redirect("/login");
        }

        res.render("home.ejs", { user });
    } catch (err) {
        console.log(err);
        // If token is invalid or expired
        res.clearCookie('token');
        res.redirect("/login");
    }
};
