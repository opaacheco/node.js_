const express = require("express");
const router = express.Router();
const ThoughtsController = require("../controllers/ThoughtsController");

//import helpers
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/add", checkAuth, ThoughtsController.createThought);
router.post("/add", checkAuth, ThoughtsController.createThoughtPost);
router.get("/dashboard", checkAuth, ThoughtsController.dashboard);
router.post("/delete", checkAuth, ThoughtsController.deleteThought);
router.get("/editThoughts/:id", checkAuth, ThoughtsController.editThought);
router.post("/editThoughts", checkAuth, ThoughtsController.editThoughtPost);

router.get("/", ThoughtsController.showThoughts);

module.exports = router;
