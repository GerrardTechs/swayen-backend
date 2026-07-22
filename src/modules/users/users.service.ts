import { ApiError } from "../../utils/ApiError";
import { usersRepository } from "./users.repository";

export const usersService = {
  async getProfile(userId: string) {
    const profile = await usersRepository.findProfileById(userId);
    if (!profile) throw ApiError.notFound("User tidak ditemukan");
    return profile;
  },
};
