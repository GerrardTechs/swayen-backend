import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { timeboxService } from "./timebox.service";

export const timeboxController = {
  start: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { durationMinutes } = req.body;
    const session = await timeboxService.startFocus(userId, durationMinutes);
    return sendSuccess(res, session, "Sesi TimeBox dimulai", 201);
  }),

  wuxiu: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const session = await timeboxService.startWuxiuNap(userId);
    return sendSuccess(res, session, "Sesi Wuxiu Nap (Low Battery) dimulai", 201);
  }),

  finish: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { sessionId, status } = req.body;
    const result = await timeboxService.finish(userId, sessionId, status);
    return sendSuccess(res, result, "Sesi berhasil diakhiri");
  }),
};
