import express, { Router } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import authRoutes from "./routes/AuthRoutes.js";
import gamesRoutes from "./routes/GamesRoutes.js";
import staticRoutes from "./routes/StaticRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import cors from "cors";

const app = express();

app.use(cors());

app.post("/login", (req, res) => {
  console.log("Hola!");
});
app.use(bodyParser.json());
app.use("/api", authRoutes);
app.use("/api", gamesRoutes);
app.use("/api", userRoutes);
app.use(staticRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001...");
});

export const router = Router();
