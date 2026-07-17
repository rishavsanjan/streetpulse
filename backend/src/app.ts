import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health/health.route.js";
import authRouter from "./routes/auth.route.js"
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/health", healthRoutes);
app.use("/api/auth", authRouter);

export default app;