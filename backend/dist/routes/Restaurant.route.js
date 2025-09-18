"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Restaurant_controller_1 = require("../controller/Restaurant.controller");
const router = express_1.default.Router();
router.get("/search/:cityOrCountry", (0, express_validator_1.param)("cityOrCountry")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("cityOrCountry parament must be a valid string"), Restaurant_controller_1.searchRestaurant);
exports.default = router;
