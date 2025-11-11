import { createContext, useContext } from "react";
import type { User } from "../types/users.ts";

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  refetchUsers: (filterLogin?: string) => Promise<void>;
  addRoleToUser: (userId: string, roleName: string) => Promise<void>;
  removeRoleFromUser: (userId: string, roleName: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
