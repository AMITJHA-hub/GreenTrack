
import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Comment must have an author."]
        },
        content: {
            type: String,
            required: [true, "Comment content cannot be empty."],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const postSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "A post must have an author."]
        },
        content: {
            type: String,
            required: [true, "Post content cannot be empty."],
            trim: true,
            maxlength: [2500, "Content cannot exceed 2500 characters."]
        },
        imageUrl: {
            type: String,
            default: ""
        },
        community: {
            type: Schema.Types.ObjectId,
            ref: "Community",
            required: [true, "A post must belong to a community to populate feeds correctly."]
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        comments: [commentSchema]
    },
    {
        timestamps: true
    }
);

export const Post = mongoose.model("Post", postSchema);
