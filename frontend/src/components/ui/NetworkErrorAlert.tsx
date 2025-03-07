import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import ReplayIcon from '@mui/icons-material/Replay';

interface NetworkErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

const NetworkErrorAlert: React.FC<NetworkErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <Alert 
      severity="error"
      icon={<WifiOffIcon fontSize="inherit" />}
      action={
        onRetry && (
          <Button 
            color="inherit" 
            size="small" 
            onClick={onRetry}
            startIcon={<ReplayIcon />}
          >
            Retry
          </Button>
        )
      }
      sx={{ 
        mt: 2, 
        mb: 2,
        '& .MuiAlert-message': { 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }
      }}
    >
      <AlertTitle>Connection Error</AlertTitle>
      {message}
      <Box mt={1} fontSize="0.875rem">
        Don't worry! You can still use our workout generator with sample data by clicking "Generate Workout Plan" again.
      </Box>
    </Alert>
  );
};

export default NetworkErrorAlert;
