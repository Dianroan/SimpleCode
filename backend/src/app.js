import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js";
import learningPathRoutes from "./routes/learningPath.js";
import jdoodleRoutes from "./routes/jdoodle.routes.js";
import exercisesRoutes from "./routes/exercises.js";
import weaknessesRoutes from "./routes/weaknesses.js";
import streaksRoutes from "./routes/streaks.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/learning-path", learningPathRoutes);
app.use("/api/jdoodle", jdoodleRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/weaknesses", weaknessesRoutes);
app.use("/api/streaks", streaksRoutes);

export default app;
