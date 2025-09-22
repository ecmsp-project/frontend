import { createContext, useContext } from "react";

interface DefaultContextType {
  defaultAction: () => void;
}

export const DefaultContext = createContext<DefaultContextType | undefined>(undefined);


export function useDefaultContext() {
  const context = useContext(DefaultContext);
  if (!context) {
    throw new Error("useDefaultContext must be used within an DefaultProvider");
  }
  return context;
}