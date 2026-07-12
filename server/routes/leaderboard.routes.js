import express from "express";
import { getGlobalPlanters, getLocalLeaderboard, getTopCommunities } from "../controllers/leaderboard.controller.js";
const router = express.Router();

router.route("/global-planters").get(getGlobalPlanters);
router.route("/top-communities").get(getTopCommunities);
router.route("/local-communities/:communityId").get(getLocalLeaderboard);
export default router;



