export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
}

export interface ProductCreateRequestDTO {
  name: string;
  categoryId: string;
  approximatePrice: number;
  deliveryPrice: number;
  description: string;
  info: Record<string, any>;
}

export interface ProductCreateResponseDTO {
  id: string;
}

export interface VariantCreateRequestDTO {
  productId: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  additionalProperties: Record<string, any>;
  description: string;
}

export interface VariantCreateResponseDTO {
  id: string;
}

export interface GetProductsRequestDTO {
  pageNumber: number;
  pageSize: number;
}

export interface GetProductsResponseDTO {
  productsRepresentation: ProductRepresentationDTO[];
  nextPageNumber: number;
}

export interface ProductRepresentationDTO {
  productId: string;
  name: string;
  variantDetail: VariantDetailDTO;
}

export interface VariantDetailDTO {
  variant_id: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  description: string;
  additionalProperties: Record<string, any>;
}
