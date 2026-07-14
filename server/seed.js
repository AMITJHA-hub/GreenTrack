import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./database/index.js";
import { Community } from "./models/community.model.js"; 


dotenv.config();


const communitiesToSeed = [
    {
        name: "Mumbai",
        boundary: {
            type: "Polygon",
            coordinates: [
                [
                    [72.80, 18.90],
                    [73.00, 18.90],
                    [73.00, 19.20],
                    [72.80, 19.20],
                    [72.80, 18.90]
                ]
            ]
        }
    },
    {
        name: "Chennai",
        boundary: {
            type: "Polygon",
            coordinates: [
                [
                    [80.00, 12.80],
                    [80.30, 12.80],
                    [80.30, 13.20],
                    [80.00, 13.20],
                    [80.00, 12.80]
                ]
            ]
        }
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log("Database connected for seeding...");
        
        for (const comm of communitiesToSeed) {
            const existingCommunity = await Community.findOne({ name: comm.name });
            if (existingCommunity) {
                console.log(`Community '${comm.name}' already exists in the database. Seeding skipped.`);
            } else {
                await Community.create(comm);
                console.log(`Successfully seeded ${comm.name} community boundary!`);
            }
        }

    } catch (error) {
        console.error("Seeding operation failed:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed cleanly. Process terminating.");
        process.exit(0);
    }
};

seedDatabase();
