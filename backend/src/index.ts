import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRouter from "./routes/MyUser.route";
import myRestaurantRouter from "./routes/MyRestaurant.route";
import RestaurantRouter from "./routes/Restaurant.route";
import { v2 as cloudinary } from "cloudinary";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database! ✅"))
  .catch((err) => console.error(`Error connecting to database: ${err} ❌`));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.get("/health", async (req: Request, res: Response) => {
  res.send("Server is healthy! ✅");
});

app.get("/", async (req: Request, res: Response) =>
  res.json({ message: "Hello World!" })
);

app.use("/api/my/user", myUserRouter);
app.use("/api/my/restaurant", myRestaurantRouter);
app.use("/api/restaurant", RestaurantRouter);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT} ✅`);
});
