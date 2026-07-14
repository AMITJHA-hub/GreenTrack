import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createPost, toggleLikePost, addComment, getCommunityFeed, deletePost } from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.middleware.js"
const router = express.Router();

router.route("/createpost").post(verifyJWT, upload.single("image"), createPost);
router.route("/togglelikepost/:postId").post(verifyJWT, toggleLikePost);
router.route("/addcomment/:postId").post(verifyJWT, addComment);
router.route("/getcommunityfeed").get(verifyJWT, getCommunityFeed);
router.route("/deletepost/:postId").delete(verifyJWT, deletePost);
export default router;