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
exports.searchRestaurant = void 0;
const restaurant_model_1 = __importDefault(require("../models/restaurant.model"));
const searchRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cityOrCountry } = req.params;
        const searchQuery = req.query.searchQuery || "";
        const selectedCuisines = req.query.selectedCuisines || "";
        const sortOption = req.query.sortOption || "lastUpdated";
        const page = parseInt(req.query.page) || 1;
        let andFilters = [];
        const locationFilter = {
            $or: [
                { city: new RegExp(cityOrCountry, "i") },
                { country: new RegExp(cityOrCountry, "i") },
            ],
        };
        const cityCheck = yield restaurant_model_1.default.countDocuments(locationFilter);
        if (cityCheck === 0) {
            return res.status(404).json({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 1,
                },
            });
        }
        andFilters.push(locationFilter);
        // cuisines filter
        if (selectedCuisines) {
            const cuisinesArray = selectedCuisines
                .split(",")
                .map((c) => new RegExp(c, "i"));
            andFilters.push({ cuisines: { $all: cuisinesArray } });
        }
        // searchQuery filter
        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery, "i");
            andFilters.push({
                $or: [
                    { restaurantName: searchRegex },
                    { cuisines: { $in: [searchRegex] } },
                ],
            });
        }
        // build final query
        const finalQuery = andFilters.length > 0 ? { $and: andFilters } : {};
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const restaurants = yield restaurant_model_1.default.find(finalQuery)
            .sort({ [sortOption]: 1 })
            .skip(skip)
            .limit(pageSize)
            .lean();
        const total = yield restaurant_model_1.default.countDocuments(finalQuery);
        const response = {
            data: restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / pageSize),
            },
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.searchRestaurant = searchRestaurant;
