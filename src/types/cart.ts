export interface CartDto {
  productDtos: CartProductDto[];
}

export interface CartProductDto {
  productId: string;
  quantity: number;
}

export interface DeleteProductRequest {
  productId: string;
}
