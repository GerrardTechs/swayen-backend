import { Router } from "express";
import { authRateLimiter } from "../../middlewares/rateLimiter.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { authController } from "./auth.controller";
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from "./auth.validation";

const router = Router();

// authRateLimiter (5 req/menit) diterapkan khusus di seluruh route auth
router.use(authRateLimiter);

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", validate(refreshSchema), authController.refresh);
router.post("/logout", validate(logoutSchema), authController.logout);

export default router;
