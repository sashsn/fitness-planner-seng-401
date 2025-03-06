import React, { ReactNode } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';

interface PageHeaderProps {
  title: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, action, subtitle }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        
        {action && (
          <Button
            variant="contained"
            startIcon={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </Box>
      
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {subtitle}
        </Typography>
      )}
      
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default PageHeader;
