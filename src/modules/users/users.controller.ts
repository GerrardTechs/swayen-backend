import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { usersService } from "./users.service";

export const usersController = {
  // authenticate middleware sudah otomatis meng-update lastActiveAt sebelum handler ini jalan
  me: asyncHandler(async (req: Request, res: Response) => {
    const profile = await usersService.getProfile(req.user!.id);
    return sendSuccess(res, profile, "Profil berhasil diambil");
  }),
};
