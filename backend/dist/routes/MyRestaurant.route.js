"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const MyRestaurant_controller_1 = require("../controller/MyRestaurant.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
router.get("/", auth_1.jwtCheck, auth_1.jwtParse, MyRestaurant_controller_1.getMyRestaurant);
router.post("/", upload.single("imageFile"), validation_1.validationMyRestaurantRequest, auth_1.jwtCheck, auth_1.jwtParse, MyRestaurant_controller_1.createMyRestaurant);
router.put("/", upload.single("imageFile"), validation_1.validationMyRestaurantRequest, auth_1.jwtCheck, auth_1.jwtParse, MyRestaurant_controller_1.updateMyRestaurant);
exports.default = router;
