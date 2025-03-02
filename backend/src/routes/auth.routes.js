const express = require("express");
const passport = require("passport");

const router = express.Router();
const authController = require("../controllers/auth.controller.js");

router.post("/signup", authController.register);
router.post("/signin", authController.login);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), authController.googleAuthCallback);

module.exports = router;