import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./database/index.js";
import cookieParser from "cookie-parser";
const app = express();
import path from "path";
app.use(
    "/api/v1/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

const PORT = process.env.PORT || 3000;


connectDB().then(async () => {
    
    try {
        const { Community } = await import("./models/community.model.js");
        const { User } = await import("./models/user.model.js");
        const Tree = (await import("./models/tree.model.js")).default;
        const { Post } = await import("./models/post.model.js");

        console.log("Synchronizing database community scores...");

        
        const communities = await Community.find();
        for (const comm of communities) {
            const treeCount = await Tree.countDocuments({ community: comm._id });
            const postCount = await Post.countDocuments({ community: comm._id });
            comm.totalPoints = (treeCount * 100) + (postCount * 50);
            await comm.save();
        }

        
        const users = await User.find();
        const { getOrCreateCommunityByCoordinates } = await import("./utils/geocoding.js");
        for (const user of users) {
            const treeCount = await Tree.countDocuments({ owner: user._id });
            const postCount = await Post.countDocuments({ author: user._id });
            
            
            const latestTree = await Tree.findOne({ owner: user._id }).sort({ createdAt: -1 });
            if (latestTree) {
                const containingCommunity = await getOrCreateCommunityByCoordinates(
                    latestTree.location.coordinates[1],
                    latestTree.location.coordinates[0]
                );
                user.community = containingCommunity._id;
            }

            user.globalPoints = (treeCount * 100) + (postCount * 50);
            user.localPoints = user.community ? user.globalPoints : 0;
            await user.save({ validateBeforeSave: false });
        }

        console.log("Database scores synchronized successfully!");
    } catch (err) {
        console.error("Failed to synchronize database scores:", err);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
        console.log("Database connection failed", error);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.send('Express server running with ES Modules and CORS enabled.');
});

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);
import treerouters from "./routes/tree.routes.js";
app.use("/api/v1/trees", treerouters);
import postRouter from "./routes/post.routes.js";
app.use("/api/v1/posts", postRouter);
import leaderboardRouter from "./routes/leaderboard.routes.js";
app.use("/api/v1/leaderboards", leaderboardRouter);
import communityRouter from "./routes/community.routes.js";
app.use("/api/v1/communities", communityRouter);
