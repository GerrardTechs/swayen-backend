"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
// Wrapper agar semua response sukses punya bentuk yang seragam
function sendSuccess(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}
//# sourceMappingURL=ApiResponse.js.map