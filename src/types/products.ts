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

export interface VariantPropertyValueRequestDTO {
  propertyId: string;
  displayText: string;
}

export interface VariantCreateGrpcRequestDTO {
  productId: string;
  price: number;
  stockQuantity: number;
  description: string;
  variantImages: string[];
  variantPropertyValues: VariantPropertyValueRequestDTO[];
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
  variantId: string;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
  variantImages: VariantImageResponseDTO[];
  additionalProperties: Record<string, any>;
}

export interface VariantImageResponseDTO {
  id: string;
  variantId: string;
  url: string;
  isMain: boolean;
  position: number;
}

export interface GetVariantResponseDTO {
  variant: VariantDetailDTO;
  selectablePropertyNames: string[];
  allVariants: Record<string, any>[];
}

export interface VariantPropertyResponseDTO {
  id: string;
  variantId: string;
  propertyId: string;
  propertyName: string;
  propertyDataType: PropertyDataType;
  valueText: string;
  valueDecimal: number;
  valueBoolean: boolean;
  valueDate: Date;
  displayText: string;
  isDefaultPropertyOption: boolean;
}

export type PropertyDataType = "TEXT" | "NUMBER" | "BOOLEAN" | "DATE";

export interface PropertyOptionDTO {
  id: string;
  displayText: string;
  isDefaultPropertyOption?: boolean;
}

export interface DefaultPropertyOptionDTO {
  id: string;
  propertyId: string;
  propertyDataType: PropertyDataType;
  valueText: string | null;
  valueDecimal: number | null;
  valueBoolean: boolean | null;
  valueDate: string | null;
  displayText: string;
}

export interface CategoryPropertyDTO {
  id: string;
  categoryId?: string;
  name: string;
  dataType: PropertyDataType;
  description?: string;
  hasDefaultOptions?: boolean;
  role?: "SELECTABLE" | "REQUIRED" | "INFO";
  propertyOptions?: PropertyOptionDTO[];
  defaultPropertyOptions?: DefaultPropertyOptionDTO[];
}

export interface CategoryPropertyGroupResponse {
  selectable?: CategoryPropertyDTO[];
  required?: CategoryPropertyDTO[];
  info?: CategoryPropertyDTO[];
}
