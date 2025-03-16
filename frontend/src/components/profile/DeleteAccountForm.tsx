import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { deleteAccount } from '../../features/profile/profileSlice';
import { logout } from '../../features/auth/authSlice';

const DeleteAccountForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.profile);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setConfirmation('');
    setError(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmation(event.target.value);
    setError(null);
  };

  const handleDeleteAccount = async () => {
    if (confirmation !== 'DELETE') {
      setError("Please type 'DELETE' to confirm");
      return;
    }

    try {
      await dispatch(deleteAccount()).unwrap();
      // Logout user and redirect to login page
      dispatch(logout());
      navigate('/login');
    } catch (err: any) {
      setError(err.toString());
    }
  };

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" paragraph>
        Deleting your account will permanently remove all your data, including workout history, fitness goals, and personal information. This action cannot be undone.
      </Typography>
      
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleOpenDialog}
      >
        Delete Account
      </Button>
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Account Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is permanent and cannot be undone. All your data will be permanently deleted. 
            If you're sure you want to proceed, please type <strong>DELETE</strong> in the field below.
          </DialogContentText>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Type 'DELETE' to confirm"
            fullWidth
            variant="outlined"
            value={confirmation}
            onChange={handleConfirmationChange}
            error={!!error}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error"
            disabled={loading || confirmation !== 'DELETE'}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteAccountForm;
