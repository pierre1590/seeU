import express from "express";
import { authUser, registerUser, updateUser, getUserProfile,mailForPasswordReset,resetPassword,logoutUser,deleteUser, searchUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.route("/register").post(registerUser).get(protect, authUser);

router.route("/login").post(authUser);

router.route("/reset").post(mailForPasswordReset).put(resetPassword);

router.get("/search", protect, searchUsers)

router.route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUser)
    .delete(protect, deleteUser);


router.route("/logout").post(logoutUser);


export default router;