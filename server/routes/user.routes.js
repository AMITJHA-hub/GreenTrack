import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    googleAuth,
    toggleFollowUser,
    getFollowing,
    getFollowers,
    getSuggestions,
    updateAvatar, 
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"; 

const router = express.Router();
router.route("/google").post(googleAuth);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/follow/:targetUserId").post(verifyJWT, toggleFollowUser);
router.route("/following").get(verifyJWT, getFollowing);
router.route("/followers").get(verifyJWT, getFollowers);
router.route("/suggestions").get(verifyJWT, getSuggestions);
router.route("/update-avatar").post(verifyJWT, upload.single("avatar"), updateAvatar); 

export default router;