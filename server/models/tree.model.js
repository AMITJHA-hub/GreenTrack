import mongoose, { Schema } from "mongoose";

const treeSchema = new Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        treeType: {
            type: String,
            required: true
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        photoUrl: {
            type: String,
            required: true
        },
        healthstatus: {
            type: String,
            enum: ["Alive", "Dead", "Sick"],
            default: "Alive"
        },
        healhistory: {
            type: Array,
            default: []
        },
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community"
        }
    },
    { timestamps: true }
)
treeSchema.index({ location: "2dsphere" });

const Tree = mongoose.model("tree", treeSchema);
export default Tree;