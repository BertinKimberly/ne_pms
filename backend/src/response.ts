import { Response } from 'express';

type ResponseData<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T
): void => {
  const response: ResponseData<T> = { success, message };
  if (data) response.data = data;
  res.status(statusCode).json(response);
};