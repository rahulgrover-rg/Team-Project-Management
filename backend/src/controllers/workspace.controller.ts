import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { changeMemberRoleService, createWorkspaceService, deleteWorkspaceService, getAllWorkspacesUserIsMemberService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMembersService, updateWorkspaceByIdService } from "../services/workspace.service";
import { changeRoleSchema, createWorkspaceSchema, updateWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { Permissions } from "../enums/role.enum";
import { roleGaurd } from "../utils/roleGaurd";

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

export const getAllWorkspacesUserIsMemberController = asyncHandler(
    async (req: Request, res:Response) =>  {
        const userId = req.user?._id;

        const {workspaces} = await getAllWorkspacesUserIsMemberService(userId) ;

        return res.status(HTTPSTATUS.OK).json({
            message: "User workspaces fetched easily",
            workspaces,
        })
    }
)

export const getWorkspaceByIdController = asyncHandler(
    async(req: Request, res:Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;
        await getMemberRoleInWorkspace(userId,workspaceId);
        const {workspace} = await getWorkspaceByIdService(workspaceId) ;
    }
)

export const getWorkspaceMembersController = asyncHandler(
    async(req:Request, res:Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id ;

        const {role} = await getMemberRoleInWorkspace(userId,workspaceId);

        roleGaurd(role, [Permissions.VIEW_ONLY]);

        const {members,roles} = await getWorkspaceMembersService(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace members retrieved successfully",
            members,
            roles,
        }) ;
    }
)

export const getWorkspaceAnalyticsController = asyncHandler(
    async(req:Request, res:Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id ;
        
        const {role} = await getMemberRoleInWorkspace(userId,workspaceId);
        roleGaurd(role, [Permissions.VIEW_ONLY]);
    
        const {analytics} = await getWorkspaceAnalyticsService(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace members retrieved successfully",
            analytics,
        })
    }
)

export const changeWorkspaceMemberRoleController = asyncHandler(
    async(req:Request, res:Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const {roleId,memberId} = changeRoleSchema.parse(req.body) 
        const userId = req.user?._id ;
        const {role} = await getMemberRoleInWorkspace(userId,workspaceId);
        roleGaurd(role, [Permissions.CHANGE_MEMBER_ROLE]);
        
        const {member} = await changeMemberRoleService(
            workspaceId,
            memberId,
            roleId,
        );

        return res.status(HTTPSTATUS.OK).json({
            message: "Member role changed successfully",
            member,
        }) ;
    }
)

export const updateWorkspaceByIdController = asyncHandler(
    async(req:Request, res:Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id) ;
        const {name,description} = updateWorkspaceSchema.parse(req.body);
        const userId = req.user?._id;
        const {role} = await getMemberRoleInWorkspace(userId,workspaceId);
        roleGaurd(role, [Permissions.EDIT_WORKSPACE]);

        const {workspace} = await updateWorkspaceByIdService(workspaceId,name,description);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace updated successfully",
            workspace,
        });
    }
)

export const deleteWorkspaceByIdController = asyncHandler(
    async(req:Request, res:Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id) ;
        const userId = req.user?._id;
        const {role} = await getMemberRoleInWorkspace(userId,workspaceId);
        roleGaurd(role, [Permissions.DELETE_WORKSPACE]);

        const {currentWorkspace} = await deleteWorkspaceService(
            workspaceId,
            userId,
        );

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace deleted successfully",
            currentWorkspace,
        })
    }
)