"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const users_controller_1 = require("./users.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get("/me", users_controller_1.usersController.me);
exports.default = router;
//# sourceMappingURL=users.routes.js.map