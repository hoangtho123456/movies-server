import express from "express";
import multer from "multer";
import { addWatchList } from "../controllers/watchListController.js";

const router = express.Router();
const upload = multer();

router.post("/", upload.none(), addWatchList);

export default router;
