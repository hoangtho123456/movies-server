import express from "express";
import multer from "multer";
import { addWatchList } from "../controllers/watchListController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer();

router.post("/", authenticateToken, upload.none(), addWatchList);

export default router;
