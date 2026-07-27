import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ProductService } from '../services/ProductService';
import type { CreateProductData, UpdateProductData } from '../types';
import type { AxiosError } from 'axios';

const PRODUCTS_KEY = 'products';

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError & { friendlyMessage?: string };
  return axiosError?.friendlyMessage || 'Ocorreu um erro inesperado.';
}

export function useProducts() {
  return useQuery({
    queryKey: [PRODUCTS_KEY],
    queryFn: ProductService.list,
  });
}

export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, id],
    queryFn: () => ProductService.findById(id!),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => ProductService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success('Produto cadastrado com sucesso!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductData }) =>
      ProductService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ProductService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success('Produto excluído com sucesso!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
