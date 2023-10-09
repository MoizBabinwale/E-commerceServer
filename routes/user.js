const express = require("express");
const router = express.Router();
const { Signup, Login, GetUsers } = require('../Controllers/appController.js');
router.post("/signup", Signup);
router.post("/login", Login);
router.get("/getAllUser", GetUsers);
module.exports = router
