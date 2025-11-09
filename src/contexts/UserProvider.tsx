import { useState, useEffect, useCallback, type ReactNode } from "react";
import { addUsersToRole, deleteUsersFromRole } from "../api/role-service.ts";
import { fetchUsers, deleteUser as apiDeleteUser } from "../api/user-service";
import type { Role, User } from "../types/users.ts";
import { UserContext } from "./UserContext";

export default function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Nie udało się załadować listy użytkowników.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchUsers();
  }, [refetchUsers]);

  const addRoleToUser = useCallback(async (userId: string, roleName: string) => {
    try {
      await addUsersToRole(roleName, [userId]);
      const newRole: Role = { name: roleName, permissions: [] };
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId && !user.roles.some((r) => r.name === roleName)
            ? { ...user, roles: [...user.roles, newRole] }
            : user,
        ),
      );
    } catch (err) {
      console.error(`Error adding role ${roleName} to user ${userId}:`, err);
      throw new Error(`Nie udało się dodać roli ${roleName} użytkownikowi.`);
    }
  }, []);

  const removeRoleFromUser = useCallback(async (userId: string, roleName: string) => {
    try {
      await deleteUsersFromRole(roleName, [userId]);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, roles: user.roles.filter((r) => r.name !== roleName) }
            : user,
        ),
      );
    } catch (err) {
      console.error(`Error removing role ${roleName} from user ${userId}:`, err);
      throw new Error(`Nie udało się usunąć roli ${roleName} użytkownikowi.`);
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      await apiDeleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      throw new Error("Nie udało się usunąć użytkownika.");
    }
  }, []);

  const contextValue = {
    users,
    loading,
    error,
    refetchUsers,
    addRoleToUser,
    removeRoleFromUser,
    deleteUser,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}
