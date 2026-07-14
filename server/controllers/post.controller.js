import { Community } from "../models/community.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import Tree from "../models/tree.model.js"; // <-- Import Tree model


export const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const authorId = req.user._id;
        const communityId = req.user.community; // Attached by your authentication middleware

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Post content cannot be empty." });
        }

        if (!communityId) {
            return res.status(400).json({
                message: "You must belong to a local community before you can share updates on the feed."
            });
        }
        let imageUrl = "";
        if (req.file) {
            imageUrl = `http://localhost:${process.env.PORT || 3000}/api/v1/uploads/${req.file.filename}`;
        }
        const newPost = await Post.create({
            author: authorId,
            content,
            imageUrl: imageUrl || "",
            community: communityId
        });

        // Award points for post creation (50 points)
        await User.findByIdAndUpdate(authorId, {
            $inc: { globalPoints: 50 }
        });
        if (communityId) {
            await Community.findByIdAndUpdate(communityId, {
                $inc: { totalPoints: 50 }
            });
        }

        const populatedPost = await Post.findById(newPost._id)
            .populate("author", "username avatar globalPoints localPoints");

        return res.status(201).json({
            success: true,
            message: "Post published successfully!",
            post: populatedPost
        });

    } catch (error) {
        return res.status(500).json({ message: "Failed to create post", error: error.message });
    }
};
export const toggleLikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const hasLiked = post.likes.includes(userId);

        // Award or deduct points for likes (5 points)
        const pointsDiff = hasLiked ? -5 : 5;
        await User.findByIdAndUpdate(userId, {
            $inc: { globalPoints: pointsDiff }
        });
        if (post.community) {
            await Community.findByIdAndUpdate(post.community, {
                $inc: { totalPoints: pointsDiff }
            });
        }

        let updateOperator = hasLiked
            ? { $pull: { likes: userId } }  // If liked, remove it (Unlike)
            : { $addToSet: { likes: userId } }; // If not liked, add it safely (Like)

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            updateOperator,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: hasLiked ? "Post unliked." : "Post liked.",
            likeCount: updatedPost.likes.length,
            hasLiked: !hasLiked
        });

    } catch (error) {
        return res.status(500).json({ message: "Error updating post likes", error: error.message });
    }
};
export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const authorId = req.user._id;

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Comment body text is required." });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        author: authorId,
                        content: content
                    }
                }
            },
            { new: true }
        ).populate("comments.author", "username avatar");

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Award points for commenting (20 points)
        await User.findByIdAndUpdate(authorId, {
            $inc: { globalPoints: 20 }
        });
        if (updatedPost.community) {
            await Community.findByIdAndUpdate(updatedPost.community, {
                $inc: { totalPoints: 20 }
            });
        }

        return res.status(201).json({
            success: true,
            message: "Comment added.",
            comments: updatedPost.comments
        });

    } catch (error) {
        return res.status(500).json({ message: "Failed to add comment", error: error.message });
    }
};
export const getCommunityFeed = async (req, res) => {
    try {
        const communityId = req.user.community;

        if (!communityId) {
            return res.status(400).json({
                message: "You are not assigned to a community. Please plant a tree or set your location first."
            });
        }

        const feedPosts = await Post.find({ community: communityId })
            .sort({ createdAt: -1 })
            .populate("author", "username avatar globalPoints localPoints")
            .populate("comments.author", "username avatar");

        // 1. Fetch total forestage (global tree count)
        const totalTrees = await Tree.countDocuments();

        // 2. Fetch top 3 star teams (communities) by points
        const starTeams = await Community.find()
            .select("name totalPoints")
            .sort({ totalPoints: -1 })
            .limit(3);

        // 3. Aggregate top 3 global trending tree types
        const trendingTrees = await Tree.aggregate([
            {
                $group: {
                    _id: "$treeType",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 3
            }
        ]);

        return res.status(200).json({
            success: true,
            count: feedPosts.length,
            feed: feedPosts,
            totalTrees,
            starTeams,
            trendingTrees
        });

    } catch (error) {
        return res.status(500).json({ message: "Error loading community feed", error: error.message });
    }
};
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Verify if the user deleting is the author of the post
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You do not have permission to delete this post."
            });
        }

        // 1. Deduct points from post creator (50 points)
        await User.findByIdAndUpdate(post.author, {
            $inc: { globalPoints: -50 }
        });

        // 2. Deduct points from users who liked the post (5 points each)
        if (post.likes && post.likes.length > 0) {
            await User.updateMany(
                { _id: { $in: post.likes } },
                { $inc: { globalPoints: -5 } }
            );
        }

        // 3. Deduct points from commenters (20 points per comment)
        if (post.comments && post.comments.length > 0) {
            const commentCountsByAuthor = {};
            for (const comment of post.comments) {
                if (comment.author) {
                    const authorStr = comment.author.toString();
                    commentCountsByAuthor[authorStr] = (commentCountsByAuthor[authorStr] || 0) + 1;
                }
            }
            for (const [authorId, count] of Object.entries(commentCountsByAuthor)) {
                await User.findByIdAndUpdate(authorId, {
                    $inc: { globalPoints: -(20 * count) }
                });
            }
        }

        // 4. Deduct points from the community's totalPoints
        if (post.community) {
            const likesCount = post.likes ? post.likes.length : 0;
            const commentsCount = post.comments ? post.comments.length : 0;
            const totalCommunityDeduction = 50 + (5 * likesCount) + (20 * commentsCount);

            await Community.findByIdAndUpdate(post.community, {
                $inc: { totalPoints: -totalCommunityDeduction }
            });
        }

        await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({ message: "Error deleting post", error: error.message });
    }
};
