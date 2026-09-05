import express from "express";
import multer from "multer";
import { register, login, resetPassword } from "../controllers/authController.js";

const router = express.Router();
const upload = multer();

// upload.none() parses multipart/form-data text fields into req.body (no files)
router.post('/register', upload.none(), register);
router.post('/login', upload.none(), login);
router.put('/reset-password', upload.none(), resetPassword);

export default router;
