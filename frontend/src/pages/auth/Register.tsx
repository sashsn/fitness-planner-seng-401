import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { clearErrors } from '../../features/auth/authSlice';
import AlertMessage from '../../components/ui/AlertMessage';
import RegisterForm from '../../components/auth/RegisterForm';

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      {error && (
        <AlertMessage 
          message={error} 
          severity="error" 
          onClose={() => setError(null)} 
          sx={{ mb: 2 }} 
        />
      )}

      <RegisterForm onError={handleError} />
    </Box>
  );
};

export default Register;
