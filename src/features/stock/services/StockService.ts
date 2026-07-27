import api from '@/services/api';
import type { StockMovement, CreateStockMovementData } from '../types';

export const StockService = {
  list: async (): Promise<StockMovement[]> => {
    const response = await api.get<StockMovement[]>('/stock-movements');
    return response.data;
  },

  findById: async (id: number): Promise<StockMovement> => {
    const response = await api.get<StockMovement>(`/stock-movements/${id}`);
    return response.data;
  },

  create: async (data: CreateStockMovementData): Promise<StockMovement> => {
    const response = await api.post<StockMovement>('/stock-movements', data);
    return response.data;
  },
};
