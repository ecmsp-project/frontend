import { createContext, useContext } from "react";
import type { GlobalSettings } from "../types/cms";

interface CMSContextType {
  settings: GlobalSettings | null;
  setSettings: (settings: GlobalSettings) => void;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  updateHeroTitle: (title: string) => void;
  updateHeroSubtitle: (subtitle: string) => void;
  updateHeroButton: (type: "primary" | "secondary", text: string) => void;
  updateFeature: (index: number, field: "title" | "description", value: string) => void;
  deleteFeature: (index: number) => void;
  addFeature: (feature: { icon: string; title: string; description: string }) => void;
  updateFooter: (field: keyof GlobalSettings["footer"], value: string | string[]) => void;
  updateCategoriesTitle: (title: string) => void;
  updateCategoriesSubtitle: (subtitle: string) => void;
}

export const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};
