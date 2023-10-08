import { Request, Response, NextFunction } from 'express';
import { genericErrorMessages } from '../others/messages/messages';

export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandling = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = error.statusCode || 500;
  console.log(error);
  const message = error.statusCode
    ? error.message
    : genericErrorMessages.intern;
  console.log(message);
  return res.status(code).json({ message });
};
