import React from 'react';
import { Alert, Box, Paper, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorDisplayProps {
  message: string;
  details?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, details }) => {
  return (
    <Box mt={3} mb={3}>
      <Alert 
        severity="error"
        icon={<ErrorOutlineIcon fontSize="inherit" />}
        sx={{
          alignItems: 'center',
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          {message}
        </Typography>
        
        {details && (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              maxHeight: '150px',
              overflow: 'auto',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}
          >
            {details}
          </Paper>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorDisplay;
