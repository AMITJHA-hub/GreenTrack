import mongoose, { Schema } from "mongoose";

const communitySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    boundary: {
        type: {
            type: String,
            enum: ["Polygon"],
            required: true
        },
        coordinates: {
            type: [[[Number]]],
            required: true
        }
    },
    totalPoints: {
        type: Number,
        default: 0
    }

});
communitySchema.index({ boundary: "2dsphere" });
export const Community = mongoose.model("Community", communitySchema);
