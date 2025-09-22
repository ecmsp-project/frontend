import { useCallback } from "react";
import {useDefaultContext} from "../contexts/DefaultContext.tsx";

export function useDeleteDraft() {
  const { defaultAction } = useDefaultContext()

  const handleDefaultAction = useCallback(() => {
    defaultAction()
  }, [defaultAction]);

  return {
    handleDefaultAction
  };
}