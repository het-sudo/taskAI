import { Request, Response, NextFunction } from "express"
import ApiError from "../utils/apiError.js"
import { ZodError } from "zod"
import { StatusCodes } from "http-status-codes"

//Global error handler middleware
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  //handling api error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      statusCode: err.statusCode,
      message: err.message,
      data: null,
    })
  }

  //handling zod error
  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Validation Error",
      errors: err.flatten().fieldErrors,
      data: null,
    })
  }
  //handling unexpected server error
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
    data: null,
  })
}

export default errorHandler
