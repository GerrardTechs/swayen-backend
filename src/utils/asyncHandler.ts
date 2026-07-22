import { NextFunction, Request, Response } from "express";

// Membungkus controller async agar error otomatis diteruskan ke error middleware,
// tanpa perlu try/catch berulang di setiap controller.
type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler = (fn: AsyncFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
