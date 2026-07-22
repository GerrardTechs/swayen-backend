"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const argon2_1 = __importDefault(require("argon2"));
// Argon2id dipilih sesuai rekomendasi OWASP untuk password hashing modern
async function hashPassword(plain) {
    return argon2_1.default.hash(plain, { type: argon2_1.default.argon2id });
}
async function verifyPassword(hash, plain) {
    return argon2_1.default.verify(hash, plain);
}
//# sourceMappingURL=password.js.map