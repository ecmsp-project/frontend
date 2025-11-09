import { createContext, useContext } from "react";

interface PermissionContextType {
  allPermissions: string[];
  loadingPermissions: boolean;
  permissionError: string | null;
  refetchPermissions: () => Promise<void>;
}

export const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function usePermissionContext() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissionContext must be used within a PermissionProvider");
  }
  return context;
}
