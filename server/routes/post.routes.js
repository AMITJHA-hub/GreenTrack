import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createPost, toggleLikePost, addComment, getCommunityFeed } from "../controllers/post.controller.js";
const router = express.Router();

router.route("/createpost").post(verifyJWT, createPost);
router.route("/togglelikepost/:postId").post(verifyJWT, toggleLikePost);
router.route("/addcomment/:postId").post(verifyJWT, addComment);
router.route("/getcommunityfeed").get(verifyJWT, getCommunityFeed);
export default router;