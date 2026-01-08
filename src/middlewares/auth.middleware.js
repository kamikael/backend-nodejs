import jwt from "jsonwebtoken";
import { TokenBlacklistService } from "../services/token-blacklist.service.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  if (await TokenBlacklistService.isBlacklisted(token)) {
    return res.status(401).json({ message: "Token revoked" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
