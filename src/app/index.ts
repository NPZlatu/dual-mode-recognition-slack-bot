import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

const { PORT } = process.env;

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
