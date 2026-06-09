import { StatusCodes } from "http-status-codes";
const sendResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: statusCode < StatusCodes.BAD_REQUEST,
        statusCode,
        message,
        data,
    });
};
export default sendResponse;
