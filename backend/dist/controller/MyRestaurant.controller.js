"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyRestaurant = exports.createMyRestaurant = exports.getMyRestaurant = void 0;
const restaurant_model_1 = __importDefault(require("../models/restaurant.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const mongoose_1 = __importDefault(require("mongoose"));
const getMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_model_1.default.findOne({ user: req.userId });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(200).json(restaurant);
    }
    catch (error) {
        console.log("Something went wrong:", error);
        res.status(500).json({ message: "Error fetching restaurant" });
    }
});
exports.getMyRestaurant = getMyRestaurant;
const createMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingRestaurant = yield restaurant_model_1.default.findOne({ user: req.userId });
        if (existingRestaurant) {
            return res
                .status(409)
                .json({ message: "User restaurant already exists" });
        }
        const imageUrl = yield uploadImage(req);
        const restaurant = new restaurant_model_1.default(req.body);
        restaurant.imageUrl = imageUrl;
        restaurant.user = new mongoose_1.default.Types.ObjectId(req.userId);
        restaurant.lastUpdated = new Date();
        yield restaurant.save();
        res.status(201).send(restaurant);
    }
    catch (error) {
        console.log("Something went wrong:", error);
        res.status(500).json({ message: "Error creating restaurant" });
    }
});
exports.createMyRestaurant = createMyRestaurant;
const updateMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_model_1.default.findOne({ user: req.userId });
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
            const imageUrl = yield uploadImage(req);
            restaurant.imageUrl = imageUrl;
        }
        yield restaurant.save();
        res.status(200).send(restaurant);
    }
    catch (error) {
        console.log("Something went wrong:", error);
        res.status(500).json({ message: "Error updating restaurant" });
    }
});
exports.updateMyRestaurant = updateMyRestaurant;
const uploadImage = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURL = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = yield cloudinary_1.default.v2.uploader.upload(dataURL, {
        folder: `food-ordering-app/${req.userId}/restaurants`,
    });
    return uploadResponse.url;
});
