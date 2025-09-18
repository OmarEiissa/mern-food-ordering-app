import express from "express";
import { param } from "express-validator";
import { searchRestaurant } from "../controller/Restaurant.controller";

const router = express.Router();

router.get(
  "/search/:cityOrCountry",
  param("cityOrCountry")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("cityOrCountry parament must be a valid string"),
  searchRestaurant
);

export default router;
