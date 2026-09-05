import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: {
            id: decoded.userId
        }});

        if (!user) {
            return res.status(401).json({
                error: "User not found"
            });
        }

        const pwdChangedAt = user.pwdChangedAt ? new Date(user.pwdChangedAt).getTime() : null;
        // console.log("pwdChangedAt:", pwdChangedAt, "decoded.pwdChangedAt:", decoded); // debugging

        if (pwdChangedAt && decoded.pwdChangedAt && pwdChangedAt > new Date(decoded.pwdChangedAt).getTime()) {
            return res.status(401).json({
                error: "Password has been changed. Please log in again."
            });
        }
        
        req.user = user; // Attach the user object to the request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Access token has expired" });
        }

        console.error("Error verifying token:", error);
        return res.status(403).json({ error: "Invalid access token" });
    }
};
