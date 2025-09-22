import { type ReactNode, useCallback } from "react";
import { DefaultContext } from "./DefaultContext";

export default function ArchiveProvider({ children }: { children: ReactNode }) {

  const defaultAction = useCallback(() => {
    console.log("elo");
  }, []);

  return (
    <DefaultContext.Provider
      value={{
        defaultAction
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}