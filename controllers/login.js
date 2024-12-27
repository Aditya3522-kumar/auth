const bcrypt = require("bcrypt");
const JwtUtil = require('../utils/jwt.util');
const User = require("../models/user");
const { COOKIE_OPTIONS } = require("../config/jwt.config");

module.exports.getLoginPage = (req, res) => {
    res.render("login.ejs");
};

module.exports.login = async(req, res) => {
    const {email, password} = req.body;
    console.log(email, password);
    
    try {
        let user = await User.findOne({email});
        if(!user) {
            console.log("user not found");
            return res.redirect("/login");
        }

        let isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) {
            console.log("wrong password");
            return res.redirect("/login");
        }

        // Generate JWT token using JwtUtil
        const token = JwtUtil.generate(
            { 
                userId: user._id,
                email: user.email
            }
        );

        // Set token in cookie
        res.cookie('token', token, COOKIE_OPTIONS);

        console.log("login success");
        res.redirect(`/profile/${user._id}`);
    } catch (error) {
        console.error("Login error:", error);
        res.redirect("/login");
    }
};
