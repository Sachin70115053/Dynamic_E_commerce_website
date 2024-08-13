const express=require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, getAllUser, getSingleUser, updateRole, deleteUser } = require("../controller/usercontroller");
const { isAuthenticateUser , authrizeRoles} = require("../middleware/auth");
const router=express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticateUser,getUserProfile);
router.route("/password/update").put(isAuthenticateUser,updatePassword);
router.route("/me/update").put(isAuthenticateUser,updateProfile);
router.route("/admin/users").get(isAuthenticateUser,authrizeRoles("admin"),getAllUser);
router.route("/admin/user/:id").get(isAuthenticateUser,authrizeRoles("admin"),getSingleUser).put(isAuthenticateUser,authrizeRoles("admin"),updateRole).delete(isAuthenticateUser,authrizeRoles("admin"),deleteUser);  

module.exports=router;