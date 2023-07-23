import express from "express";
const router = express.Router();

// Import paths of the specific routes
import userRoutes from "./userRoutes.js";
import videoChatRoutes from "./videochatRoutes.js";

// Middleware to use for all routes
router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

// Routes
router.use("/users", userRoutes);
router.use("/videochat", videoChatRoutes)


export default router;