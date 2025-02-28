import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createWorkspaceService } from "../services/workspace.service";
import { createWorkspaceSchema } from "../validation/workspace.validation";

export const createWorkspaceController = asyncHandler(
    async(req: Request, res:Response) => {
        const body = createWorkspaceSchema.parse(req.body);
        const userId = req.user?._id ;
        const {workspace} = await createWorkspaceService(userId,body) ;
        res.status(HTTPSTATUS.CREATED).json({
            message: "Workspace created successfully",
            workspace,
        });
    }
)