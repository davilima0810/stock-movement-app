import type { ProductType } from '@/features/products/types';

export interface ProductStockReport {
  productId: number;
  code: string;
  description: string;
  availableQuantity: number;
  totalExitQuantity: number;
}

export interface ProductProfitReport {
  productId: number;
  code: string;
  description: string;
  totalSold: number;
  totalProfit: number;
}

export type { ProductType };
