import { Community } from "../models/community.model.js";
import { User } from "../models/user.model.js";
import Tree from "../models/tree.model.js";
import { getOrCreateCommunityByCoordinates } from "../utils/geocoding.js";

export const getMyCommunityDetails = async (req, res) => {
    try {
        let communityId = req.user.community;

        if (!communityId) {
            const userTree = await Tree.findOne({ owner: req.user._id });
            if (userTree) {
                let matchedComm = userTree.community;
                if (!matchedComm) {
                    const dynamicComm = await getOrCreateCommunityByCoordinates(
                        userTree.location.coordinates[1],
                        userTree.location.coordinates[0]
                    );
                    matchedComm = dynamicComm._id;
                    await Tree.updateMany({ owner: req.user._id }, { $set: { community: matchedComm } });
                }
                if (matchedComm) {
                    await User.findByIdAndUpdate(req.user._id, { $set: { community: matchedComm } });
                    communityId = matchedComm;
                }
            }
        }

        if (!communityId) {
            return res.status(200).json({
                success: true,
                hasCommunity: false,
                message: "You are not assigned to a community. Please plant a tree first to be auto-assigned."
            });
        }

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found." });
        }

        const memberCount = await User.countDocuments({ community: communityId });
        const treeCount = await Tree.countDocuments({ community: communityId });

        return res.status(200).json({
            success: true,
            hasCommunity: true,
            community: {
                _id: community._id,
                name: community.name,
                totalPoints: community.totalPoints,
                memberCount,
                treeCount
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
