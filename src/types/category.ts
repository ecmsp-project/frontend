import type { CategoryFromAPI } from "./cms";

// Request DTOs matching backend
export interface CategoryCreateRequestDTO {
  name: string;
  parentCategoryId?: string | null;
  childCategoryId?: string | null;
}

export interface CategoryUpdateRequestDTO {
  name?: string;
  parentCategoryId?: string | null;
}

// Response DTOs matching backend
export interface CategoryCreateResponseDTO {
  id: string;
  name: string;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  subCategoryCount: number;
  productCount: number;
  propertyCount: number;
}

// Category creation modes (using type union instead of enum)
export type CategoryCreationMode = "LEAF" | "SPLIT" | "SPLIT_ALL";

// Extended category type with children for tree structure
export interface CategoryTreeNode extends CategoryFromAPI {
  children: CategoryTreeNode[];
}

// React Flow node data
export interface CategoryNodeData extends Record<string, unknown> {
  category: CategoryFromAPI;
  onAddLeaf: (categoryId: string) => void;
  onDelete: () => void;
}

// React Flow edge data
export interface CategoryEdgeData extends Record<string, unknown> {
  onAddBetween: () => void;
}

// Dialog state types
export interface CategoryFormDialogState {
  open: boolean;
  mode: CategoryCreationMode;
  parentCategoryId?: string;
  childCategoryId?: string;
  parentCategoryName?: string;
  childCategoryName?: string;
}

export interface CategoryDeleteDialogState {
  open: boolean;
  category?: CategoryFromAPI;
}
