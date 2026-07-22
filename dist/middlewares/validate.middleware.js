"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
// Memvalidasi body/query/params sekaligus menggunakan skema Zod per-route
const validate = (schema) => (req, _res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return next(ApiError_1.ApiError.badRequest("Validasi input gagal", err.flatten().fieldErrors));
        }
        next(err);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map