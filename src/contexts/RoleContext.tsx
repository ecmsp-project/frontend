import { createContext, useContext } from "react";
import type { Role } from "../types/users.ts";

interface RoleContextType {
  roles: Role[];
  refetchRoles: () => Promise<void>;
  addRole: (role: Role) => Promise<void>;
  updateRole: (role: Role) => Promise<void>;
  deleteRole: (roleName: string) => Promise<void>;
}

export const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}
