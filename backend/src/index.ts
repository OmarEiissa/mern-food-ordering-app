import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

import myUserRouter from "./routes/MyUser.route";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database! ✅"))
  .catch((err) => console.error(`Error connecting to database: ${err} ❌`));

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  res.send("Server is healthy! ✅");
});

app.get("/", async (req: Request, res: Response) =>
  res.json({ message: "Hello World!" })
);

app.use("/api/my/user", myUserRouter);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT} ✅`);
});
