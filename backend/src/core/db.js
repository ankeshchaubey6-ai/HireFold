import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "./env.js";

/* =========================================================
   DATABASE CONNECTION
========================================================= */
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4
    });

    if (NODE_ENV !== "production") {
      // Database connected in development mode
    } else {
      // Database connected
    }

  } catch (error) {
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

/* =========================================================
   CONNECTION EVENTS
========================================================= */
mongoose.connection.on("disconnected", () => {
  // Connection lost
});

mongoose.connection.on("reconnected", () => {
  // Connection re-established
});

/* =========================================================
   GRACEFUL SHUTDOWN
========================================================= */
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
