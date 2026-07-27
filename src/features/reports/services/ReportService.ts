import api from '@/services/api';
import type { ProductType } from '@/features/products/types';
import type { ProductStockReport, ProductProfitReport } from '../types';

export const ReportService = {
  byType: async (type: ProductType): Promise<ProductStockReport[]> => {
    const response = await api.get<ProductStockReport[]>(`/products/report/type/${type}`);
    return response.data;
  },

  profit: async (): Promise<ProductProfitReport[]> => {
    const response = await api.get<ProductProfitReport[]>('/products/report/profit');
    return response.data;
  },
};
