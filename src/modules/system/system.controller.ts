import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { systemService } from "./system.service";

export const systemController = {
  // Publik — quote harian tidak spesifik ke user, tidak butuh auth
  quoteToday: asyncHandler(async (_req: Request, res: Response) => {
    const quote = await systemService.getTodayQuote();
    return sendSuccess(res, quote, "Quote hari ini berhasil diambil");
  }),

  // Butuh auth karena status dihitung per-user (dipanggil WorkManager/Cron dgn token user)
  engagementStatus: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const status = await systemService.getEngagementStatus(userId);
    return sendSuccess(res, status, "Status engagement berhasil diambil");
  }),
};
