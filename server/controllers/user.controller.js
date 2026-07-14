import { User } from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";
import Tree from "../models/tree.model.js";
import { Post } from "../models/post.model.js";
import { getOrCreateCommunityByCoordinates } from "../utils/geocoding.js";
import fs from "fs";
import path from "path";

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);
export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const {
            sub: googleId,
            email,
            name,
            picture,
            email_verified: emailVerified,
        } = payload;

        if (!emailVerified) {
            return res.status(400).json({
                message: "Google email is not verified",
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            const usernameBase = name
                .toLowerCase()
                .replace(/\s+/g, "");

            let username = usernameBase;

            const usernameExists = await User.findOne({ username });

            if (usernameExists) {
                username = `${usernameBase}${Date.now()}`;
            }

            user = await User.create({
                username,
                email,
                authProvider: "google",
                googleId,
                avatar: picture || "",
            });
        } else {
            if (!user.googleId) {
                user.googleId = googleId;
            }

            if (!user.avatar && picture) {
                user.avatar = picture;
            }

            await user.save({
                validateBeforeSave: false,
            });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({
            validateBeforeSave: false,
        });

        const loggedInUser = user.toObject();

        delete loggedInUser.password;
        delete loggedInUser.refreshToken;

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "Google authentication successful",
                user: loggedInUser,
            });

    } catch (error) {
        console.error("Google authentication error:", error);

        return res.status(401).json({
            message: "Google authentication failed",
        });
    }
};
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existeduser = await User.findOne({ $or: [{ email }, { username }] });
        if (existeduser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({
            username,
            email,
            password
        });
        const createduser = await User.findById(user._id).select("-password -refreshToken");
        if (!createduser) {
            return res.status(500).json({ message: "User not created" });
        }
        return res.status(201).json({ message: "User created successfully", user: createduser });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const loggedInUser = user.toObject();
        delete loggedInUser.password;
        delete loggedInUser.refreshToken;

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({
            message: "User logged in successfully",
            user: loggedInUser,
            accessToken
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const logoutUser = async (req, res) => {
    try {
        const userId = req.user?._id || req.user;
        await User.findByIdAndUpdate(
            userId,
            { $set: { refreshToken: undefined } },
            { new: true }
        )
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user._id;

        let communityId = req.user.community;
        if (!communityId) {
            const userTree = await Tree.findOne({ owner: userId });
            if (userTree) {
                let matchedComm = userTree.community;
                if (!matchedComm) {
                    const dynamicComm = await getOrCreateCommunityByCoordinates(
                        userTree.location.coordinates[1],
                        userTree.location.coordinates[0]
                    );
                    matchedComm = dynamicComm._id;
                    await Tree.updateMany({ owner: userId }, { $set: { community: matchedComm } });
                }
                if (matchedComm) {
                    await User.findByIdAndUpdate(userId, { $set: { community: matchedComm } });
                    communityId = matchedComm;
                }
            }
        }

        const treeCount = await Tree.countDocuments({ owner: userId });
        const postCount = await Post.countDocuments({ author: userId });

        const user = req.user.toObject ? req.user.toObject() : req.user;
        user.treeCount = treeCount;
        user.postCount = postCount;
        if (communityId) {
            user.community = communityId;
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const toggleFollowUser = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user._id;

        if (targetUserId.toString() === userId.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const currentUser = await User.findById(userId);

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId.toString());
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId.toString());
            await currentUser.save({ validateBeforeSave: false });
            await targetUser.save({ validateBeforeSave: false });

            return res.status(200).json({
                success: true,
                message: `Unfollowed ${targetUser.username} successfully.`,
                isFollowing: false
            });
        } else {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(userId);
            await currentUser.save({ validateBeforeSave: false });
            await targetUser.save({ validateBeforeSave: false });

            return res.status(200).json({
                success: true,
                message: `Followed ${targetUser.username} successfully.`,
                isFollowing: true
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            "following",
            "username email avatar globalPoints"
        );
        return res.status(200).json({
            success: true,
            following: user.following || []
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            "followers",
            "username email avatar globalPoints"
        );
        return res.status(200).json({
            success: true,
            followers: user.followers || []
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getSuggestions = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentUser = await User.findById(userId);

        const excludedUserIds = [userId, ...(currentUser.following || [])];

        const suggestions = await User.find({
            _id: { $nin: excludedUserIds }
        })
            .select("username avatar globalPoints")
            .sort({ globalPoints: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            suggestions
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        const userId = req.user._id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Please upload an avatar image file." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.avatar && user.avatar.startsWith("/uploads/")) {
            const filename = user.avatar.replace("/uploads/", "");
            const filePath = path.join(process.cwd(), "uploads", filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting old avatar file:", err);
            });
        }

        user.avatar = `/uploads/${file.filename}`;
        await user.save();
        const updatedUser = await User.findById(userId)
            .populate("community", "name border");

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully.",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({ message: "Failed to update profile picture.", error: error.message });
    }
};
