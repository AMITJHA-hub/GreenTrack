import { User } from "../models/user.model.js";
import Tree from "../models/tree.model.js";
import { Community } from "../models/community.model.js";
import fs from "fs";
import path from "path";

export const registerTree = async (req, res) => {
    try {
        const owner = req.user._id;
        const { treeType, latitude, longitude } = req.body;

        const image = req.file;

        if (
            !owner ||
            !treeType ||
            !image ||
            latitude == null ||
            longitude == null
        ) {
            return res.status(400).json({ message: "All fields, including location coordinates, are required." });
        }

        // 1. Search for a community polygon containing this tree's coordinates
        let containingCommunity = await Community.findOne({
            boundary: {
                $geoIntersects: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            Number(longitude),
                            Number(latitude),
                        ],
                    },
                },
            },
        });

        // Fallback to the first community in the database if no direct match is found
        if (!containingCommunity) {
            containingCommunity = await Community.findOne();
        }

        // 2. Initialize the points increment logic
        const pointsUpdate = { globalPoints: 10 };
        const userUpdates = { $inc: pointsUpdate };

        // 3. If a community matches, layer on local points and the dynamic $set community link
        if (containingCommunity) {
            pointsUpdate.localPoints = 10;

            // Dynamically assign the user to this community inside their document
            userUpdates.$set = { community: containingCommunity._id };

            await Community.findByIdAndUpdate(containingCommunity._id, {
                $inc: { totalPoints: 10 },
            });
        }

        // 4. Create the tree document in the database
        const photoUrl = `/uploads/${image.filename}`;
        const tree = await Tree.create({
            treeType,
            photoUrl,
            location: {
                type: "Point",
                coordinates: [
                    Number(longitude),
                    Number(latitude),
                ],
            },
            owner: req.user._id,
            community: containingCommunity ? containingCommunity._id : undefined,
        });
        const createdtree = await Tree.findById(tree._id);
        if (!createdtree) {
            return res.status(500).json({ message: "Tree data could not be initialized." });
        }

        // 5. Update the user using the combined $inc and $set structure
        const updatedUser = await User.findByIdAndUpdate(
            owner,
            userUpdates,
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: containingCommunity
                ? `Successfully registered a new tree and joined the ${containingCommunity.name} community!`
                : `Successfully registered a new tree!`,
            data: {
                tree: createdtree,
                communityFound: !!containingCommunity,
                currentPoints: {
                    global: updatedUser.globalPoints,
                    local: updatedUser.localPoints || 0,
                    total: updatedUser.globalPoints + (updatedUser.localPoints || 0)
                }
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const getuserTrees = async (req, res) => {
    try {
        const userId = req.user._id;

        const trees = await Tree.find({ owner: userId });

        return res.status(200).json({
            success: true,
            message: "Trees fetched successfully",
            data: trees,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteTree = async (req, res) => {
    try {
        const { treeId } = req.params;
        const userId = req.user._id;

        const tree = await Tree.findById(treeId);
        if (!tree) {
            return res.status(404).json({ message: "Tree not found." });
        }

        // Verify ownership
        if (tree.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this tree." });
        }

        // Delete photo file if it exists
        if (tree.photoUrl) {
            const filename = tree.photoUrl.replace("/uploads/", "");
            const filePath = path.join(process.cwd(), "uploads", filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting image file:", err);
            });
        }

        // Deduct points
        const pointsUpdate = { globalPoints: -10 };
        const userUpdates = { $inc: pointsUpdate };

        if (tree.community) {
            pointsUpdate.localPoints = -10;
            await Community.findByIdAndUpdate(tree.community, {
                $inc: { totalPoints: -10 },
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            userUpdates,
            { new: true }
        );

        // Delete the tree document
        await Tree.findByIdAndDelete(treeId);

        return res.status(200).json({
            success: true,
            message: "Tree deleted successfully and points updated.",
            data: {
                currentPoints: {
                    global: updatedUser.globalPoints,
                    local: updatedUser.localPoints || 0,
                    total: updatedUser.globalPoints + (updatedUser.localPoints || 0)
                }
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

