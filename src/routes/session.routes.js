import { Router } from "express";
import { SessionController } from "../controllers/session.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(isAuthenticated);

router.get("/", SessionController.list);
router.post("/:id/revoke", SessionController.revoke);
router.post("/revoke-all", SessionController.revokeAll);

export default router;
