import React from 'react';
import { Box, Grid, Paper, Typography, Divider, Chip } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { PageHeader, Loading } from '@/components/common';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useStockMovements } from '@/features/stock/hooks/useStockMovements';
import { MOVEMENT_TYPE_LABELS } from '@/features/stock/types';
import { PRODUCT_TYPE_LABELS } from '@/features/products/types';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: `${color}.light`,
        color: `${color}.dark`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.disabled">
          {subtitle}
        </Typography>
      )}
    </Box>
  </Paper>
);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const Dashboard: React.FC = () => {
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: movements = [], isLoading: loadingMovements } = useStockMovements();

  if (loadingProducts || loadingMovements) return <Loading />;

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stockQuantity <= 5);
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0);

  const totalEntries = movements.filter((m) => m.movementType === 'ENTRY').length;
  const totalExits = movements.filter((m) => m.movementType === 'EXIT').length;

  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime())
    .slice(0, 5);

  return (
    <Box>
      <PageHeader title="Dashboard" />

      {/* Cards de resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total de Produtos"
            value={totalProducts}
            icon={<InventoryIcon />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Entradas registradas"
            value={totalEntries}
            icon={<TrendingUpIcon />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Saídas registradas"
            value={totalExits}
            icon={<TrendingDownIcon />}
            color="error"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Estoque baixo / zerado"
            value={`${lowStockProducts.length} / ${outOfStockProducts.length}`}
            icon={<WarningAmberIcon />}
            color="warning"
            subtitle="≤ 5 unidades / sem estoque"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Movimentações recentes */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
              Últimas Movimentações
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {recentMovements.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                Nenhuma movimentação registrada ainda.
              </Typography>
            ) : (
              recentMovements.map((m) => (
                <Box
                  key={m.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={MOVEMENT_TYPE_LABELS[m.movementType]}
                      color={m.movementType === 'ENTRY' ? 'success' : 'error'}
                      size="small"
                    />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {m.productCode}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(m.movementDate)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {m.movementType === 'ENTRY' ? '+' : '−'}
                    {m.quantity} un.
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* Produtos com estoque baixo */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
              Atenção: Estoque Baixo
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {lowStockProducts.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                Todos os produtos têm estoque adequado.
              </Typography>
            ) : (
              lowStockProducts.map((p) => (
                <Box
                  key={p.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {p.code}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {PRODUCT_TYPE_LABELS[p.type]}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${p.stockQuantity} un.`}
                    color={p.stockQuantity === 0 ? 'error' : 'warning'}
                    size="small"
                  />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
