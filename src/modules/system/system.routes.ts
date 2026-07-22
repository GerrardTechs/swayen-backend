import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { systemController } from "./system.controller";

const router = Router();

router.get("/quotes/today", systemController.quoteToday);
router.get("/engagement-status", authenticate, systemController.engagementStatus);

export default router;
