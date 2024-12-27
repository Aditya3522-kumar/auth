const User = require("../models/user");
const bcrypt = require("bcrypt");
const JwtUtil = require('../utils/jwt.util');
const { COOKIE_OPTIONS } = require("../config/jwt.config");

module.exports.getSignupPage = (req, res) => {
    res.render("signup.ejs", { error: null });
};

module.exports.signup = async (req, res) => {
    try {
        let { email, password, password2 } = req.body;

        // Validate input
        if (!email || !password || !password2) {
            return res.render("signup.ejs", { 
                error: "Please fill in all fields" 
            });
        }

        // Check if passwords match
        if (password !== password2) {
            return res.render("signup.ejs", { 
                error: "Passwords do not match" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup.ejs", { 
                error: "Email already in use" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        let user = new User({
            email, 
            password: hashedPassword
        });
        await user.save();
        
        // Generate JWT token
        const token = JwtUtil.generate({ 
            userId: user._id,
            email: user.email
        });

        // Set token in cookie
        res.cookie('token', token, COOKIE_OPTIONS);

        // Redirect to profile
        return res.redirect(`/profile/${user._id}`);

    } catch (error) {
        console.error("Signup error:", error);
        return res.render("signup.ejs", { 
            error: "An error occurred during signup. Please try again." 
        });
    }
};