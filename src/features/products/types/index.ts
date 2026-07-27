export type ProductType = 'ELECTRONIC' | 'HOME_APPLIANCE' | 'FURNITURE';

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  ELECTRONIC: 'Eletrônico',
  HOME_APPLIANCE: 'Eletrodoméstico',
  FURNITURE: 'Móvel',
};

export interface Product {
  id: number;
  code: string;
  description: string;
  type: ProductType;
  supplierPrice: number;
  stockQuantity: number;
}

export interface CreateProductData {
  code: string;
  description: string;
  type: ProductType;
  supplierPrice: number;
  stockQuantity: number;
}

export interface UpdateProductData {
  description: string;
  type: ProductType;
  supplierPrice: number;
  stockQuantity: number;
}
