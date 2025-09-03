import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

export const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.log("Something went wrong:", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

export const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "User restaurant already exists" });
    }

    const imageUrl = await uploadImage(req as Request);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();

    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.log("Something went wrong:", error);
    res.status(500).json({ message: "Error creating restaurant" });
  }
};

export const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req as Request);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();

    res.status(200).send(restaurant);
  } catch (error) {
    console.log("Something went wrong:", error);
    res.status(500).json({ message: "Error updating restaurant" });
  }
};

const uploadImage = async (req: Request) => {
  const image = req.file as Express.Multer.File;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURL = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURL, {
    folder: `food-ordering-app/${req.userId}/restaurants`,
  });

  return uploadResponse.url;
};
