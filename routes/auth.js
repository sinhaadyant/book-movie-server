const express = require("express");
const controller = require("../controller/auth");

const router = express.Router();

router.post("/signup", controller.handleSignup);
router.post("/signin", controller.handleSignin);
router.get("/profile", controller.handleGetUserProfile);

module.exports = router;
