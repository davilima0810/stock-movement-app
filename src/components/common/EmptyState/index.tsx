import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = 'Nenhum registro encontrado.' }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, color: 'text.secondary' }}>
      <InboxIcon sx={{ fontSize: 60, mb: 2, color: 'text.disabled' }} />
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
};
