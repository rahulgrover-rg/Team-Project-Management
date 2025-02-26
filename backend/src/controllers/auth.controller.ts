import { Request, Response } from "express";
import { config } from "../config/app.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const googleLoginCallback = asyncHandler(async(req:Request, res: Response)=> {
    const currentWorkspace = req.user?.currentWorkSpace;
    if(!currentWorkspace) {
        return res.redirect(
            `${config.FRONTEND_CALLBACK_URL}?status=failure`
        );
    }

    return res.redirect(
        `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    );
}) 