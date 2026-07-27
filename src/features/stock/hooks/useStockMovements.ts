import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { StockService } from '../services/StockService';
import type { CreateStockMovementData } from '../types';
import type { AxiosError } from 'axios';

const STOCK_MOVEMENTS_KEY = 'stock-movements';

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError & { friendlyMessage?: string };
  return axiosError?.friendlyMessage || 'Ocorreu um erro inesperado.';
}

export function useStockMovements() {
  return useQuery({
    queryKey: [STOCK_MOVEMENTS_KEY],
    queryFn: StockService.list,
  });
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStockMovementData) => StockService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [STOCK_MOVEMENTS_KEY] });
      // Invalida produtos pois estoque muda
      queryClient.invalidateQueries({ queryKey: ['products'] });
      const label = variables.movementType === 'ENTRY' ? 'Entrada' : 'Saída';
      toast.success(`${label} registrada com sucesso!`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
