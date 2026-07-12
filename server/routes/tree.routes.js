import express from "express";
import { registerTree, getuserTrees, deleteTree } from "../controllers/tree.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = express.Router();
router.route("/register").post(
    verifyJWT,
    upload.single("image"),
    registerTree
);
router.route("/getusertrees").get(verifyJWT, getuserTrees);
router.route("/delete/:treeId").delete(verifyJWT, deleteTree);

export default router;