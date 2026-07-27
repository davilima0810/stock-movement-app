import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PageHeader, DataTable, Button, Loading, ConfirmDialog } from '@/components/common';
import type { Column } from '@/components/common/DataTable';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import type { Product } from '../types';
import { PRODUCT_TYPE_LABELS } from '../types';

export const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleConfirmDelete = () => {
    if (deleteId === null) return;
    deleteProduct.mutate(deleteId, {
      onSettled: () => setDeleteId(null),
    });
  };

  const columns: Column<Product>[] = [
    { id: 'code', label: 'Código' },
    { id: 'description', label: 'Descrição' },
    {
      id: 'type',
      label: 'Tipo',
      render: (row) => (
        <Chip label={PRODUCT_TYPE_LABELS[row.type]} size="small" variant="outlined" />
      ),
    },
    {
      id: 'supplierPrice',
      label: 'Preço Fornecedor',
      render: (row) =>
        row.supplierPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
    {
      id: 'stockQuantity',
      label: 'Estoque',
      render: (row) => (
        <Chip
          label={row.stockQuantity}
          color={row.stockQuantity === 0 ? 'error' : row.stockQuantity <= 5 ? 'warning' : 'success'}
          size="small"
        />
      ),
    },
    {
      id: 'id',
      label: 'Ações',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/produtos/${row.id}`)}
              aria-label={`editar-produto-${row.id}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              color="error"
              onClick={() => setDeleteId(row.id)}
              aria-label={`excluir-produto-${row.id}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <Box>
      <PageHeader
        title="Produtos"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/produtos/novo')}
            id="btn-novo-produto"
          >
            Novo Produto
          </Button>
        }
      />
      <DataTable<Product>
        columns={columns}
        data={products}
        keyExtractor={(row) => row.id}
      />
      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir produto"
        description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteProduct.isPending}
      />
    </Box>
  );
};
