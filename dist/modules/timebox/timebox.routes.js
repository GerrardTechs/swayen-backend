"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const timebox_controller_1 = require("./timebox.controller");
const timebox_validation_1 = require("./timebox.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get("/active", timebox_controller_1.timeboxController.getActive);
router.post("/start", (0, validate_middleware_1.validate)(timebox_validation_1.startTimeBoxSchema), timebox_controller_1.timeboxController.start);
router.post("/finish", (0, validate_middleware_1.validate)(timebox_validation_1.finishTimeBoxSchema), timebox_controller_1.timeboxController.finish);
router.post("/wuxiu", (0, validate_middleware_1.validate)(timebox_validation_1.startWuxiuSchema), timebox_controller_1.timeboxController.wuxiu);
exports.default = router;
//# sourceMappingURL=timebox.routes.js.map