import { API_BASE_URL, apiCall } from './utils';
import type {
    ProductCreateRequestDTO,
    ProductCreateResponseDTO,
    VariantCreateRequestDTO,
    VariantCreateResponseDTO
} from '../types/products';

const PRODUCT_API = `${API_BASE_URL}/api/products`;
const VARIANT_API = `${API_BASE_URL}/api/variants`;

export const createProduct = async (productData: ProductCreateRequestDTO): Promise<ProductCreateResponseDTO> => {
    try {
        const response = await apiCall(PRODUCT_API, {
            method: 'POST',
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create product: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error creating product:', error);
        throw error;
    }
};

export const createVariant = async (variantData: VariantCreateRequestDTO): Promise<VariantCreateResponseDTO> => {
    try {
        const response = await apiCall(VARIANT_API, {
            method: 'POST',
            body: JSON.stringify(variantData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create variant: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error creating variant:', error);
        throw error;
    }
};
