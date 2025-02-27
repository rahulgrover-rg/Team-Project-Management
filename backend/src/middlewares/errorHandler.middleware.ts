import { ErrorRequestHandler, Response } from "express";
import {z,  ZodError } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { AppError } from "../utils/appError";

const formatZodError = (res: Response, error: z.ZodError)=> {
    const errors = error?.issues?.map((err)=> ({
        field: err.path.join("."),
        message: err.message,
    }));
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR, 
    })
}

export const errorHandler: ErrorRequestHandler = (error,req,res,next): any=> {

    console.log(`Error occured on PATH: ${req.path} : `, error.message);

    if( error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid Syntax. Please check your request."
        })
    }

    if(error instanceof ZodError) {
        return formatZodError(res,error) ;
    }

    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            message : error.message ,
            errorCode: error.errorCode
        })
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: error?.message || "Internal Server Error", 
        error : "Unknown error occured"
    })
}