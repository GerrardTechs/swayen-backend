import { prisma } from "../../config/prisma";

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser(email: string, passwordHash: string, name: string) {
    return prisma.user.create({ data: { email, passwordHash, name } });
  },

  createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({ data: { userId, token, expiresAt } });
  },

  findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  },

  revokeRefreshTokenById(id: string) {
    return prisma.refreshToken.update({ where: { id }, data: { revoked: true } });
  },
};
