import { Router } from "express";
import { ProfileController } from "#controllers/profile.controller";
import  {isAuthenticated}  from "#middlewares/auth.middleware";

const router = Router();

router.get("/get", isAuthenticated, ProfileController.get);
router.put("/update", isAuthenticated, ProfileController.update);
router.delete("/delete", isAuthenticated, ProfileController.delete);

export default router;
