import type { GetCategoriesResponse } from "../types/cms";
import type {
  ProductCreateRequestDTO,
  ProductCreateResponseDTO,
  VariantCreateRequestDTO,
  VariantCreateResponseDTO,
} from "../types/products";
import { apiCall } from "./utils";

const PRODUCT_SERVICE_URL = "http://localhost:8400";
const PRODUCT_API = `${PRODUCT_SERVICE_URL}/api/products`;
const VARIANT_API = `${PRODUCT_SERVICE_URL}/api/variants`;
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

export const createVariant = async (
  variantData: VariantCreateRequestDTO,
): Promise<VariantCreateResponseDTO> => {
  try {
    const response = await apiCall(VARIANT_API, {
      method: "POST",
      body: JSON.stringify(variantData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create variant: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error creating variant:", error);
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
