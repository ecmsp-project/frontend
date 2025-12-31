import { type ReactNode, useCallback, useEffect, useState } from "react";
import { fetchRolesPermissions } from "../api/role-service.ts";
import { PermissionContext } from "./PermissionContext.tsx";

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const refetchPermissions = useCallback(async () => {
    setLoadingPermissions(true);
    try {
      const permissions = await fetchRolesPermissions();
      setAllPermissions(permissions);
      setPermissionError(null);
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setPermissionError("Failed to load permissions list.");
    } finally {
      setLoadingPermissions(false);
    }
  }, []);

  useEffect(() => {
    refetchPermissions();
  }, [refetchPermissions]);

  const contextValue = {
    allPermissions,
    loadingPermissions,
    permissionError,
    refetchPermissions,
  };

  return <PermissionContext.Provider value={contextValue}>{children}</PermissionContext.Provider>;
}
