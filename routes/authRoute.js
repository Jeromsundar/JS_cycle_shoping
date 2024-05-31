const express = require("express");
const { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updatedUser } = require("../controller/userCtrl"); // Corrected the controller import
const {authMiddleware }= require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all_users",getallUser);
router.get("/:id",authMiddleware, getaUser);
router.delete("/:id",deleteaUser);
router.put("/:id",updatedUser);

module.exports = router;
