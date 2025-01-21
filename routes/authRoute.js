const express = require("express");
const { createUser, 
    loginUserCtrl, 
    getallUser, getaUser, 
    deleteaUser, updatedUser, 
    unblockUser, blockUser,
    handleRefreshToken,
    logout } = require("../controller/userCtrl"); 
const {authMiddleware, isAdmin }= require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all_users",getallUser);
router.get("/referesh",handleRefreshToken);
router.get("/logout",logout);

router.get("/:id",authMiddleware,isAdmin, getaUser);
router.delete("/:id",deleteaUser);
router.put("/edit-user/:id",authMiddleware,updatedUser);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);

module.exports = router;