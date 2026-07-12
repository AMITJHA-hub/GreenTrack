import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getMyCommunityDetails } from "../controllers/community.controller.js";

const router = express.Router();

router.route("/me").get(verifyJWT, getMyCommunityDetails);

export default router;
