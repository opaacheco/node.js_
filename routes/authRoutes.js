const express = require("express");
const router = express.Router();
const AuthenticateController = require("../controllers/AuthenticateController");

router.get("/login", AuthenticateController.login);
router.post("/login", AuthenticateController.loginPost);
router.get("/register", AuthenticateController.register);
router.post("/register", AuthenticateController.registerCreate);
router.get("/logout", AuthenticateController.logout);

module.exports = router;
