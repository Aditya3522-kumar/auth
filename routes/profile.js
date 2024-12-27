const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');

// Profile page route
router.get("/:id", profileController.getProfile);

module.exports = router;
