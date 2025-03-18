import { PermissionType } from "@/constant"
import { UserType, WorkspaceWithMembersType } from "@/types/api.type"
import { useEffect, useMemo, useState } from "react"


const usePermissions = (
    user: UserType | undefined,
    workspace: WorkspaceWithMembersType | undefined,
) => {
    const [permissions, setPermissions] = useState<PermissionType[]>([])

    useEffect(()=>{
        console.log("user",user, "workspace",workspace);
        if(user && workspace) {
            const member = workspace.members.find((member)=> member.userId === user._id);
            if(member) {
                setPermissions(member.role.permissions || []);
            }
        }
        console.log(permissions) ;
    },[user,workspace])

  return useMemo(()=>permissions, [permissions]);
  
}

export default usePermissions