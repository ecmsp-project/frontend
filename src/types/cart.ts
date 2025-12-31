export interface Cart {
  productDtos: ProductDtos[];
}

export interface ProductDtos {
  productId: number;
  quantity: number;
}

export interface DeleteProductRequest {
  productId: number;
}
