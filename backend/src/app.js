import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js"; // ← añade esto

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], optionsSuccessStatus: 200 }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes); // ← y esto

export default app;
