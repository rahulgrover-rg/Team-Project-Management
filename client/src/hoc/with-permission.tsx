/* eslint-disable @typescript-eslint/no-explicit-any */
import { PermissionType } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import useWorkspaceId from "@/hooks/use-workspace-id";
import * as React from "react";
import { useNavigate } from "react-router-dom";

const withPermission = (
  WrappedComponent: React.ComponentType,
  requiredPermission: PermissionType,
) => {
  const WithPermission = (props: any) => {
    const {user,hasPermission,isLoading} = useAuthContext();
    const navigate = useNavigate();
    const workspaceId = useWorkspaceId();

    React.useEffect(() => {
      if(!user || !hasPermission(requiredPermission)) {
        navigate(`/workspace/${workspaceId}`);
      }
    },[user,hasPermission,workspaceId,navigate]) ;

    if(!isLoading) {
      return <div>Loading...</div>
    }

    if(!user || !hasPermission(requiredPermission)) {
      return ;
    }

    return <WrappedComponent {...props} />
  }
  return WithPermission;
};

export default withPermission;
