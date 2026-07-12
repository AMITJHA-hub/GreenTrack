import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Mongoose connection failure:", error);
        process.exit(1);
    }
};

export default connectDB;
