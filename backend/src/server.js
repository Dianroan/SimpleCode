import app from "./app.js";
import { env } from "./config/env.js";
import dotenv from "dotenv";
dotenv.config();

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});
