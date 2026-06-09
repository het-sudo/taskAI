import { Response } from "express"
import { StatusCodes } from "http-status-codes"

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null
) => {
  return res.status(statusCode).json({
    success: statusCode < StatusCodes.BAD_REQUEST,
    statusCode,
    message,
    data,
  })
}

export default sendResponse
