import express, { Router } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import staticRoutes from "./routes/StaticRoutes.js";
import cors from "cors";

const PORT=process.env.PORT_FRONT

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(staticRoutes);

app.listen(PORT, () => {
  console.log(`El frontend esta corrientdo en: ${PORT}...`);
});

export const router = Router();
