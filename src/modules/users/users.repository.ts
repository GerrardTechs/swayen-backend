import { prisma } from "../../config/prisma";

export const usersRepository = {
  findProfileById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        lastActiveAt: true,
        createdAt: true,
        updatedAt: true,
        // passwordHash sengaja tidak di-select
      },
    });
  },
};
