import { User } from "../models/user.model.js";
import { Community } from "../models/community.model.js";


export const getGlobalPlanters = async (req, res) => {
    try {
        const topPlanters = await User.find()
            .select("username avatar globalPoints")
            .sort({ globalPoints: -1 }) 
            .limit(10); 

        return res.status(200).json({
            success: true,
            data: topPlanters
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load global leaderboard", error: error.message });
    }
};


export const getTopCommunities = async (req, res) => {
    try {
        const topCommunities = await Community.find()
            .select("name totalPoints")
            .sort({ totalPoints: -1 }) 
            .limit(10);

        return res.status(200).json({
            success: true,
            data: topCommunities
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load communities leaderboard", error: error.message });
    }
};


export const getLocalLeaderboard = async (req, res) => {
    try {
        const { communityId } = req.params;

        const localPlanters = await User.find({ community: communityId })
            .select("username avatar localPoints")
            .sort({ localPoints: -1 }) 
            .limit(10);

        return res.status(200).json({
            success: true,
            data: localPlanters
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load local leaderboard", error: error.message });
    }
};
