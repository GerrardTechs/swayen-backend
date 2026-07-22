"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("../modules/users/users.routes"));
const nightPlanner_routes_1 = __importDefault(require("../modules/night-planner/nightPlanner.routes"));
const timebox_routes_1 = __importDefault(require("../modules/timebox/timebox.routes"));
const swayen_routes_1 = __importDefault(require("../modules/swayen/swayen.routes"));
const system_routes_1 = __importDefault(require("../modules/system/system.routes"));
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.use("/auth", auth_routes_1.default);
exports.apiRouter.use("/users", users_routes_1.default);
exports.apiRouter.use("/night-planner", nightPlanner_routes_1.default);
exports.apiRouter.use("/timebox", timebox_routes_1.default);
exports.apiRouter.use("/swayen", swayen_routes_1.default);
exports.apiRouter.use("/system", system_routes_1.default);
//# sourceMappingURL=index.js.map