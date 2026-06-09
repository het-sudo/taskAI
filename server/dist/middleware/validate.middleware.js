import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger.js";
export const validate = (schemas) => (req, res, next) => {
    try {
        req.validated = {
            body: undefined,
            query: undefined,
            params: undefined,
        };
        if (schemas.body) {
            req.validated.body = schemas.body.parse(req.body);
        }
        if (schemas.query) {
            req.validated.query = schemas.query.parse(req.query);
        }
        if (schemas.params) {
            req.validated.params = schemas.params.parse(req.params);
        }
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            logger.error("validation error in middleware", {
                errors: error.issues,
            });
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error.issues[0]?.message,
                errors: error.flatten().fieldErrors,
            });
            return;
        }
        logger.error("unknown validation error", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        });
    }
};
