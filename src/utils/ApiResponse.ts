import { Response } from "express";

// Wrapper agar semua response sukses punya bentuk yang seragam
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
