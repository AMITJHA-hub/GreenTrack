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


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
    .catch((error) => {
        console.log("Database connection failed", error);
        process.exit(1);
    })

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
