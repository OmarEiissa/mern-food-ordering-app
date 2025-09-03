import express from "express";
import multer from "multer";
import {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
} from "../controller/MyRestaurant.controller";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validationMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.get("/", jwtCheck, jwtParse, getMyRestaurant);

router.post(
  "/",
  upload.single("imageFile"),
  validationMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  createMyRestaurant
);

router.put(
  "/",
  upload.single("imageFile"),
  validationMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  updateMyRestaurant
);

export default router;
