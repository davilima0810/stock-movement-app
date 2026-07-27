import React, { useState } from 'react';
import {
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader, DataTable, Button, Loading, Input } from '@/components/common';
import type { Column } from '@/components/common/DataTable';
import { useStockMovements, useCreateStockMovement } from '../hooks/useStockMovements';
import { stockMovementSchema, type StockMovementFormValues } from '../schemas/stockMovementSchema';
import { useProducts } from '@/features/products/hooks/useProducts';
import type { StockMovement } from '../types';
import { MOVEMENT_TYPE_LABELS } from '../types';

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const StockList: React.FC = () => {
  const { data: movements = [], isLoading } = useStockMovements();
  const { data: products = [] } = useProducts();
  const createMovement = useCreateStockMovement();

  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<StockMovementFormValues>({
    resolver: zodResolver(stockMovementSchema),
    defaultValues: {
      productId: 0,
      movementType: 'ENTRY',
      salePrice: 0,
      quantity: 1,
    },
  });

  const movementType = watch('movementType');

  const handleOpen = () => {
    reset({ productId: 0, movementType: 'ENTRY', salePrice: 0, quantity: 1 });
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const onSubmit = (values: StockMovementFormValues) => {
    createMovement.mutate(values, {
      onSuccess: () => {
        setDialogOpen(false);
        reset();
      },
    });
  };

  const columns: Column<StockMovement>[] = [
    { id: 'id', label: '#' },
    { id: 'productCode', label: 'Produto' },
    {
      id: 'movementType',
      label: 'Tipo',
      render: (row) => (
        <Chip
          label={MOVEMENT_TYPE_LABELS[row.movementType]}
          color={row.movementType === 'ENTRY' ? 'success' : 'error'}
          size="small"
          icon={row.movementType === 'ENTRY' ? <AddIcon /> : <RemoveIcon />}
        />
      ),
    },
    { id: 'quantity', label: 'Quantidade' },
    {
      id: 'salePrice',
      label: 'Preço de Venda',
      render: (row) =>
        row.salePrice > 0
          ? row.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : '—',
    },
    {
      id: 'movementDate',
      label: 'Data',
      render: (row) => formatDate(row.movementDate),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <Box>
      <PageHeader
        title="Movimentações de Estoque"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            id="btn-nova-movimentacao"
          >
            Nova Movimentação
          </Button>
        }
      />

      <DataTable<StockMovement>
        columns={columns}
        data={movements}
        keyExtractor={(row) => row.id}
      />

      {/* Dialog de nova movimentação */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Movimentação</DialogTitle>
        <DialogContent>
          <Box component="form" id="form-movimentacao" noValidate sx={{ pt: 1 }}>
            {/* Tipo de movimentação */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tipo de Movimentação
              </Typography>
              <Controller
                name="movementType"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    {...field}
                    exclusive
                    onChange={(_, value) => value && field.onChange(value)}
                    fullWidth
                  >
                    <ToggleButton value="ENTRY" color="success" id="toggle-entry">
                      <AddIcon sx={{ mr: 1 }} /> Entrada
                    </ToggleButton>
                    <ToggleButton value="EXIT" color="error" id="toggle-exit">
                      <RemoveIcon sx={{ mr: 1 }} /> Saída
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Box>

            {/* Produto */}
            <Controller
              name="productId"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  select
                  label="Produto"
                  id="input-product"
                  error={!!errors.productId}
                  helperText={errors.productId?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <MenuItem value={0} disabled>
                    Selecione um produto
                  </MenuItem>
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.code} — {p.description}{' '}
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        (estoque: {p.stockQuantity})
                      </Typography>
                    </MenuItem>
                  ))}
                </Input>
              )}
            />

            {/* Quantidade */}
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Quantidade"
                  id="input-quantity"
                  type="number"
                  slotProps={{ htmlInput: { step: '1', min: '1' } }}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                />
              )}
            />

            {/* Preço de venda (obrigatório para saída) */}
            <Controller
              name="salePrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={`Preço de Venda (R$)${movementType === 'EXIT' ? ' *' : ''}`}
                  id="input-sale-price"
                  type="number"
                  slotProps={{ htmlInput: { step: '0.01', min: '0' } }}
                  error={!!errors.salePrice}
                  helperText={
                    errors.salePrice?.message ||
                    (movementType === 'ENTRY' ? 'Não aplicável para entradas (opcional)' : '')
                  }
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={createMovement.isPending} id="btn-cancelar-mov">
            Cancelar
          </Button>
          <Button
            variant="contained"
            color={movementType === 'ENTRY' ? 'success' : 'error'}
            loading={createMovement.isPending}
            onClick={handleSubmit(onSubmit)}
            id="btn-confirmar-mov"
          >
            {movementType === 'ENTRY' ? 'Registrar Entrada' : 'Registrar Saída'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
