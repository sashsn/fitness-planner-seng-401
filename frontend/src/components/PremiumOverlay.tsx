import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const PremiumOverlay: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1,
        borderRadius: 1,
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      }}
    >
      <LockIcon sx={{ mr: 1 }} />
      <Typography variant="subtitle1" sx={{ mr: 2 }}>
        Unlock Premium Features
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate('/register')}
      >
        Register / Login
      </Button>
    </Paper>
  );
};

export default PremiumOverlay;
