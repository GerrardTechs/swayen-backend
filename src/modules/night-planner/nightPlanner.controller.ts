import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { nightPlannerService } from "./nightPlanner.service";

export const nightPlannerController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { tasks } = req.body;
    const plan = await nightPlannerService.createOrUpdateToday(userId, tasks);
    return sendSuccess(res, plan, "Rencana malam berhasil disimpan", 201);
  }),

  getToday: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await nightPlannerService.getToday(userId);
    return sendSuccess(res, result, "Rencana malam hari ini berhasil diambil");
  }),

  complete: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const plan = await nightPlannerService.complete(userId, id);
    return sendSuccess(res, plan, "Rencana malam ditandai selesai");
  }),

  toggleTask: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id, taskIndex } = req.params;
    const { completed } = req.body;
    const plan = await nightPlannerService.toggleTask(
      userId,
      id,
      Number(taskIndex),
      completed,
    );
    return sendSuccess(res, plan, "Status task berhasil diperbarui");
  }),
};
