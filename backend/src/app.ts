import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health/health.route.js";
import authRouter from "./routes/auth.route.js"
import profileRouter from "./routes/profile.route.js"
import postRouter from "./routes/post.route.js"
import reactionRouter from "./routes/reaction.route.js"

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/health", healthRoutes);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/post", postRouter)
app.use("/api/reaction", reactionRouter)

export default app;