const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

// Login page route
router.get("/", loginController.getLoginPage);

// Login form submission
router.post("/", loginController.login);

module.exports = router;