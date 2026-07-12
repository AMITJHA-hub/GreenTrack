import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userschema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: function () {
                return this.authProvider === "local";
            },
        },
        globalPoints: {
            type: Number,
            default: 0
        },
        localPoints: {
            type: Number,
            default: 0
        },
        badges: {
            type: Array,
            default: []
        },
        avatar: {
            type: String,
            default: ""
        },
        refreshToken: {
            type: String,
        },
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community"
        },
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },

        googleId: {
            type: String,
            default: null,
        },

    },
    {
        timestamps: true
    }
)
userschema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userschema.methods.isPasswordCorrect = async function (password) {
    if (!this.password) {
        return false;
    }

    return await bcrypt.compare(password, this.password);
};
userschema.methods.generateAccessToken = function () {
    return JWT.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userschema.methods.generateRefreshToken = function () {
    return JWT.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userschema);