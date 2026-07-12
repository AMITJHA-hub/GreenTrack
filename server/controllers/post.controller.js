import { Community } from "../models/community.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";


export const createPost = async (req, res) => {
    try {
        const { content, imageUrl } = req.body;
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

        const newPost = await Post.create({
            author: authorId,
            content,
            imageUrl: imageUrl || "",
            community: communityId
        });
        const populatedPost = await Post.findById(newPost._id)
            .populate("author", "username avatar");

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

        return res.status(200).json({
            success: true,
            count: feedPosts.length,
            feed: feedPosts
        });

    } catch (error) {
        return res.status(500).json({ message: "Error loading community feed", error: error.message });
    }
};
