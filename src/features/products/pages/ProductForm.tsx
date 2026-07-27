import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader, Button, Input, Loading } from '@/components/common';
import { productSchema, type ProductFormValues } from '../schemas/productSchema';
import { useProduct, useCreateProduct, useUpdateProduct } from '../hooks/useProducts';
import { PRODUCT_TYPE_LABELS } from '../types';
import type { ProductType } from '../types';

const PRODUCT_TYPES = Object.entries(PRODUCT_TYPE_LABELS) as [ProductType, string][];

export const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : undefined;
  const isEditing = !!productId;

  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: '',
      description: '',
      type: 'ELECTRONIC',
      supplierPrice: 0,
      stockQuantity: 0,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        code: product.code,
        description: product.description,
        type: product.type,
        supplierPrice: product.supplierPrice,
        stockQuantity: product.stockQuantity,
      });
    }
  }, [product, reset]);

  const onSubmit = (values: ProductFormValues) => {
    if (isEditing) {
      const { code: _code, ...updateData } = values;
      updateProduct.mutate(
        { id: productId, data: updateData },
        { onSuccess: () => navigate('/produtos') }
      );
    } else {
      createProduct.mutate(values, {
        onSuccess: () => navigate('/produtos'),
      });
    }
  };

  if (isEditing && isLoadingProduct) return <Loading />;

  return (
    <Box>
      <PageHeader title={isEditing ? 'Editar Produto' : 'Novo Produto'} />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEditing ? `Editando: ${product?.code}` : 'Preencha os dados do produto'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Código"
                    id="input-code"
                    error={!!errors.code}
                    helperText={errors.code?.message}
                    disabled={isEditing}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    select
                    label="Tipo"
                    id="input-type"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    {PRODUCT_TYPES.map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Input>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Descrição"
                    id="input-description"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="supplierPrice"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Preço Fornecedor (R$)"
                    id="input-supplier-price"
                    type="number"
                    slotProps={{ htmlInput: { step: '0.01', min: '0.01' } }}
                    error={!!errors.supplierPrice}
                    helperText={errors.supplierPrice?.message}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="stockQuantity"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Quantidade em Estoque"
                    id="input-stock-quantity"
                    type="number"
                    slotProps={{ htmlInput: { step: '1', min: '0' } }}
                    error={!!errors.stockQuantity}
                    helperText={errors.stockQuantity?.message}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/produtos')}
              disabled={isSubmitting}
              id="btn-cancelar"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              id="btn-salvar"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
