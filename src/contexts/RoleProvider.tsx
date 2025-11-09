import { type ReactNode, useCallback, useEffect, useState } from "react";
import { addRole, deleteRole, fetchRoles, updateRole } from "../api/role-service.ts";
import type { Role } from "../types/users.ts";
import { RoleContext } from "./RoleContext.tsx";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [roles, setRoles] = useState<Role[]>([]);

  const refetchRoles = useCallback(async () => {
    try {
      const fetchedRoles = await fetchRoles();
      setRoles(fetchedRoles);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  }, []);

  useEffect(() => {
    refetchRoles();
  }, [refetchRoles]);

  const handleAddRole = async (newRole: Role) => {
    try {
      await addRole(newRole);
      setRoles((prevRoles) => [...prevRoles, newRole]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdateRole = async (roleToUpdate: Role) => {
    try {
      await updateRole(roleToUpdate);
      setRoles((prevRoles) =>
        prevRoles.map((role) => (role.name === roleToUpdate.name ? roleToUpdate : role)),
      );
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleDeleteRole = async (roleName: string) => {
    try {
      await deleteRole(roleName);
      setRoles((prevRoles) => prevRoles.filter((role) => role.name !== roleName));
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const contextValue = {
    roles,
    refetchRoles,
    addRole: handleAddRole,
    updateRole: handleUpdateRole,
    deleteRole: handleDeleteRole,
  };

  return <RoleContext.Provider value={contextValue}>{children}</RoleContext.Provider>;
}
