import express, { Router } from "express";
import bodyParser from "body-parser";
import staticRoutes from "./routes/StaticRoutes.js";
import cors from "cors";

const PORT=3001;

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(staticRoutes);

app.listen(PORT, () => {
  console.log(`El frontend esta corrientdo en: ${PORT}...`);
});

export const router = Router();
