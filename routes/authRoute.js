const express = require("express");
const { createUser } = require("../controller/userCtrl"); // Corrected the controller import
const router = express.Router();

router.post("/register", createUser);
module.exports = router;
