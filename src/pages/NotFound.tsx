import React from 'react';
import { Box } from '@mui/material';
import { EmptyState, Button } from '@/components/common';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <EmptyState message="Página não encontrada (404)." />
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
        Voltar para a Home
      </Button>
    </Box>
  );
};
