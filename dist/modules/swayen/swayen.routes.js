"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const swayen_controller_1 = require("./swayen.controller");
const swayen_validation_1 = require("./swayen.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get("/balance", swayen_controller_1.swayenController.getBalance);
router.get("/hobbies", swayen_controller_1.swayenController.listHobbies);
router.post("/hobbies", (0, validate_middleware_1.validate)(swayen_validation_1.createHobbySchema), swayen_controller_1.swayenController.createHobby);
router.post("/spend", (0, validate_middleware_1.validate)(swayen_validation_1.spendCoinSchema), swayen_controller_1.swayenController.spend);
exports.default = router;
//# sourceMappingURL=swayen.routes.js.map