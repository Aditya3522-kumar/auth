const express = require("express");
const app = express();
const expressLayouts = require('ejs-mate');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const User = require("./models/user");
const profileController = require('./controllers/profile');
const forgotPasswordRoutes = require('./routes/forgotPassword');

require('dotenv').config();

// Database connection
const connectDB = require("./config/db");
connectDB();

// View engine setup
app.engine('ejs', expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const signupRoutes = require("./routes/signup");
const loginRoutes = require("./routes/login");
const logoutRoutes = require("./routes/logout");
const profileRoutes = require("./routes/profile");

// Home route
app.get("/", profileController.home);

// Route handlers
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);
app.use("/profile", profileRoutes);
app.use("/forgot-password", forgotPasswordRoutes);

// Start server
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});