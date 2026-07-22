"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rateLimiter_middleware_1 = require("../../middlewares/rateLimiter.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
// authRateLimiter (5 req/menit) diterapkan khusus di seluruh route auth
router.use(rateLimiter_middleware_1.authRateLimiter);
router.post("/register", (0, validate_middleware_1.validate)(auth_validation_1.registerSchema), auth_controller_1.authController.register);
router.post("/login", (0, validate_middleware_1.validate)(auth_validation_1.loginSchema), auth_controller_1.authController.login);
router.post("/refresh", (0, validate_middleware_1.validate)(auth_validation_1.refreshSchema), auth_controller_1.authController.refresh);
router.post("/logout", (0, validate_middleware_1.validate)(auth_validation_1.logoutSchema), auth_controller_1.authController.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map