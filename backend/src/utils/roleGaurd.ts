import { permission } from "process";
import { PermissionType } from "../enums/role.enum";
import { RolePermissions } from "./role-permission";
import { UnauthorizedException } from "./appError";

export const roleGaurd = (
    role: keyof typeof RolePermissions,
    requiredPermissions: PermissionType[]
) => {
    const permissions = RolePermissions[role];
    const hasPermissions = requiredPermissions.every((permission)=>permissions.includes(permission)) ;

    if(!hasPermissions) {
        throw new UnauthorizedException(
            "You do not have the necessary permissions to perform this action"
        );
    }

    
}