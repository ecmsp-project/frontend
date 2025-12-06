import type {
  CategoryCreateRequestDTO,
  CategoryCreateResponseDTO,
  CategoryUpdateRequestDTO,
} from "../types/category";
import type { GetCategoriesResponse, CategoryFromAPI } from "../types/cms";
import type {
  GetProductsRequestDTO,
  GetProductsResponseDTO,
  GetVariantResponseDTO,
  ProductCreateRequestDTO,
  ProductCreateResponseDTO,
  VariantPropertyResponseDTO,
} from "../types/products";
import { apiCall } from "./utils";

const PRODUCT_SERVICE_URL = "http://localhost:8400";
const PRODUCT_API = `${PRODUCT_SERVICE_URL}/api/products`;
const VARIANT_API = `${PRODUCT_SERVICE_URL}/api/variant`;
const CATEGORY_API = `${PRODUCT_SERVICE_URL}/api/categories`;

export const createProduct = async (
  productData: ProductCreateRequestDTO,
): Promise<ProductCreateResponseDTO> => {
  try {
    const response = await apiCall(PRODUCT_API, {
      method: "POST",
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error creating product:", error);
    throw error;
  }
};

export const getRootCategories = async (): Promise<GetCategoriesResponse> => {
  try {
    const response = await apiCall(`${CATEGORY_API}/subcategories`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching categories:", error);
    throw error;
  }
};

// Get all categories (flat list)
export const getAllCategories = async (): Promise<GetCategoriesResponse> => {
  try {
    const response = await apiCall(CATEGORY_API, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch all categories: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching all categories:", error);
    throw error;
  }
};

// Get subcategories of a specific category
export const getSubcategories = async (categoryId: string): Promise<GetCategoriesResponse> => {
  try {
    const response = await apiCall(`${CATEGORY_API}/${categoryId}/subcategories`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch subcategories: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching subcategories:", error);
    throw error;
  }
};

// Get single category by ID
export const getCategoryById = async (categoryId: string): Promise<CategoryFromAPI> => {
  try {
    const response = await apiCall(`${CATEGORY_API}/${categoryId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching category:", error);
    throw error;
  }
};

// Create new category
// Supports 3 modes:
// 1. LEAF: only parentCategoryId (add as leaf)
// 2. SPLIT: parentCategoryId + childCategoryId (insert between parent and specific child)
// 3. SPLIT_ALL: only parentCategoryId (insert between parent and all children)
export const createCategory = async (
  categoryData: CategoryCreateRequestDTO,
): Promise<CategoryCreateResponseDTO> => {
  try {
    const response = await apiCall(CATEGORY_API, {
      method: "POST",
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error creating category:", error);
    throw error;
  }
};

// Update category (name and/or parent)
// Note: This endpoint is not yet implemented in CategoryController, only in service
export const updateCategory = async (
  categoryId: string,
  categoryData: CategoryUpdateRequestDTO,
): Promise<CategoryFromAPI> => {
  try {
    const response = await apiCall(`${CATEGORY_API}/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update category: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error updating category:", error);
    throw error;
  }
};

// Delete category
// Note: This endpoint is not yet implemented in CategoryController, only in service
// When implemented, subcategories will be moved to the parent of deleted category
export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    const response = await apiCall(`${CATEGORY_API}/${categoryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete category: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("API Error deleting category:", error);
    throw error;
  }
};

export const getProductsByCategory = async (
  categoryId: string,
  request: GetProductsRequestDTO,
): Promise<GetProductsResponseDTO> => {
  try {
    const url = new URL(PRODUCT_API);
    url.searchParams.set("categoryId", categoryId);

    const response = await apiCall(url.toString(), {
      method: "POST",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching products:", error);
    throw error;
  }
};

export const searchProducts = async (
  query: string,
  request: GetProductsRequestDTO,
): Promise<GetProductsResponseDTO> => {
  try {
    const url = new URL(`${PRODUCT_API}/search`);
    url.searchParams.set("query", query);

    const response = await apiCall(url.toString(), {
      method: "POST",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error searching products:", error);
    throw error;
  }
};

export const getAllVariantDetails = async (variantId: string): Promise<GetVariantResponseDTO> => {
  try {
    const response = await apiCall(`${VARIANT_API}/${variantId}/details`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get all variant details: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Error getting all variant details:", error);
    throw error;
  }
};

export const getVariantDetails = async (variantId: string): Promise<GetVariantResponseDTO> => {
  try {
    const response = await apiCall(`${VARIANT_API}/${variantId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to get variant details: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error getting variant details:", error);
    throw error;
  }
};

export const getVariantProperties = async (
  variantId: string,
): Promise<Record<string, VariantPropertyResponseDTO[]>> => {
  try {
    const response = await apiCall(`${VARIANT_API}/${variantId}/properties`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get variant properties: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Error getting variant properties:", error);
    throw error;
  }
};
