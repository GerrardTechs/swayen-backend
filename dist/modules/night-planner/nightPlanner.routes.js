"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const nightPlanner_controller_1 = require("./nightPlanner.controller");
const nightPlanner_validation_1 = require("./nightPlanner.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post("/", (0, validate_middleware_1.validate)(nightPlanner_validation_1.createNightPlanSchema), nightPlanner_controller_1.nightPlannerController.create);
router.get("/today", nightPlanner_controller_1.nightPlannerController.getToday);
router.patch("/:id/complete", (0, validate_middleware_1.validate)(nightPlanner_validation_1.completeNightPlanSchema), nightPlanner_controller_1.nightPlannerController.complete);
exports.default = router;
//# sourceMappingURL=nightPlanner.routes.js.map