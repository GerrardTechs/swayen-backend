"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const system_controller_1 = require("./system.controller");
const router = (0, express_1.Router)();
router.get("/quotes/today", system_controller_1.systemController.quoteToday);
router.get("/engagement-status", auth_middleware_1.authenticate, system_controller_1.systemController.engagementStatus);
exports.default = router;
//# sourceMappingURL=system.routes.js.map