import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  MenuItem,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { PageHeader, DataTable, Input, Loading } from '@/components/common';
import type { Column } from '@/components/common/DataTable';
import { useReportByType, useProfitReport } from '../hooks/useReports';
import type { ProductStockReport, ProductProfitReport } from '../types';
import type { ProductType } from '@/features/products/types';
import { PRODUCT_TYPE_LABELS } from '@/features/products/types';

const PRODUCT_TYPES = Object.entries(PRODUCT_TYPE_LABELS) as [ProductType, string][];

const stockReportColumns: Column<ProductStockReport>[] = [
  { id: 'code', label: 'Código' },
  { id: 'description', label: 'Descrição' },
  { id: 'availableQuantity', label: 'Qtd. Disponível' },
  { id: 'totalExitQuantity', label: 'Total de Saídas' },
];

const profitReportColumns: Column<ProductProfitReport>[] = [
  { id: 'code', label: 'Código' },
  { id: 'description', label: 'Descrição' },
  { id: 'totalSold', label: 'Qtd. Vendida' },
  {
    id: 'totalProfit',
    label: 'Lucro Total',
    render: (row) =>
      row.totalProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  },
];

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedType, setSelectedType] = useState<ProductType | ''>('');

  const {
    data: stockReport = [],
    isLoading: isLoadingStock,
    isError: isErrorStock,
  } = useReportByType(selectedType || null);

  const {
    data: profitReport = [],
    isLoading: isLoadingProfit,
    isError: isErrorProfit,
  } = useProfitReport();

  return (
    <Box>
      <PageHeader title="Relatórios" />

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          indicatorColor="primary"
          textColor="primary"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Relatório por Tipo" id="tab-by-type" />
          <Tab label="Relatório de Lucro" id="tab-profit" />
        </Tabs>

        {/* Aba 1: Relatório por Tipo */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Selecione o tipo de produto para visualizar o relatório de estoque.
            </Typography>
            <Box sx={{ maxWidth: 300, mb: 3 }}>
              <Input
                select
                label="Tipo de Produto"
                id="select-product-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ProductType)}
                margin="normal"
              >
                {PRODUCT_TYPES.map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Input>
            </Box>

            {!selectedType && (
              <Alert severity="info">Selecione um tipo de produto para exibir o relatório.</Alert>
            )}

            {selectedType && isLoadingStock && <Loading />}

            {selectedType && isErrorStock && (
              <Alert severity="error">Erro ao carregar relatório. Tente novamente.</Alert>
            )}

            {selectedType && !isLoadingStock && !isErrorStock && (
              <DataTable<ProductStockReport>
                columns={stockReportColumns}
                data={stockReport}
                keyExtractor={(row) => row.productId}
              />
            )}
          </Box>
        )}

        {/* Aba 2: Relatório de Lucro */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Relatório de lucro por produto com base nas saídas registradas.
            </Typography>

            {isLoadingProfit && <Loading />}

            {isErrorProfit && (
              <Alert severity="error">Erro ao carregar relatório de lucro. Tente novamente.</Alert>
            )}

            {!isLoadingProfit && !isErrorProfit && (
              <DataTable<ProductProfitReport>
                columns={profitReportColumns}
                data={profitReport}
                keyExtractor={(row) => row.productId}
              />
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};
