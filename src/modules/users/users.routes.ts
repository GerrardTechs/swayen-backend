import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { usersController } from "./users.controller";

const router = Router();

router.use(authenticate);

router.get("/me", usersController.me);

export default router;
