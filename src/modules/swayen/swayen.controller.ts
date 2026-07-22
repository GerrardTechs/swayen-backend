import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { swayenService } from "./swayen.service";

export const swayenController = {
  getBalance: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await swayenService.getBalanceWithHistory(userId);
    return sendSuccess(res, result, "Saldo & riwayat Swayen Coin berhasil diambil");
  }),

  listHobbies: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const hobbies = await swayenService.listHobbies(userId);
    return sendSuccess(res, hobbies, "Daftar Quick-Start Hobbies berhasil diambil");
  }),

  createHobby: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { title, durationMinutes, deepLinkUrl } = req.body;
    const hobby = await swayenService.createHobby(userId, title, durationMinutes, deepLinkUrl);
    return sendSuccess(res, hobby, "Hobi baru berhasil ditambahkan", 201);
  }),

  spend: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { amount, activityName, hobbyId } = req.body;
    const wallet = await swayenService.spendCoins(userId, amount, activityName, hobbyId);
    return sendSuccess(res, wallet, "Koin berhasil digunakan");
  }),
};
