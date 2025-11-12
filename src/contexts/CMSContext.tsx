import React, { createContext, useContext, useState, type ReactNode } from "react";
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

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [isDirty, setDirty] = useState(false);

  const updateHeroTitle = (title: string) => {
    if (!settings) return;
    setSettings({ ...settings, hero: { ...settings.hero, title } });
    setDirty(true);
  };

  const updateHeroSubtitle = (subtitle: string) => {
    if (!settings) return;
    setSettings({ ...settings, hero: { ...settings.hero, subtitle } });
    setDirty(true);
  };

  const updateHeroButton = (type: "primary" | "secondary", text: string) => {
    if (!settings) return;
    const field = type === "primary" ? "primaryButtonText" : "secondaryButtonText";
    setSettings({ ...settings, hero: { ...settings.hero, [field]: text } });
    setDirty(true);
  };

  const updateFeature = (index: number, field: "title" | "description", value: string) => {
    if (!settings) return;
    const features = [...settings.features];
    features[index] = { ...features[index], [field]: value };
    setSettings({ ...settings, features });
    setDirty(true);
  };

  const deleteFeature = (index: number) => {
    if (!settings) return;
    const features = settings.features.filter((_, i) => i !== index);
    setSettings({ ...settings, features });
    setDirty(true);
  };

  const addFeature = (feature: { icon: string; title: string; description: string }) => {
    if (!settings) return;
    const newFeature = { ...feature, id: `feature-${Date.now()}` };
    setSettings({ ...settings, features: [...settings.features, newFeature] });
    setDirty(true);
  };

  const updateFooter = (
    field: keyof GlobalSettings["footer"],
    value: string | string[],
  ) => {
    if (!settings) return;
    setSettings({ ...settings, footer: { ...settings.footer, [field]: value } });
    setDirty(true);
  };

  const updateCategoriesTitle = (title: string) => {
    if (!settings) return;
    setSettings({ ...settings, categoriesTitle: title });
    setDirty(true);
  };

  const updateCategoriesSubtitle = (subtitle: string) => {
    if (!settings) return;
    setSettings({ ...settings, categoriesSubtitle: subtitle });
    setDirty(true);
  };

  return (
    <CMSContext.Provider
      value={{
        settings,
        setSettings,
        isEditMode,
        setEditMode,
        isDirty,
        setDirty,
        updateHeroTitle,
        updateHeroSubtitle,
        updateHeroButton,
        updateFeature,
        deleteFeature,
        addFeature,
        updateFooter,
        updateCategoriesTitle,
        updateCategoriesSubtitle,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};
