import React, { useState } from 'react';
import { Alert, AlertProps, Collapse, IconButton, SxProps, Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AlertMessageProps {
  message: string;
  severity?: AlertProps['severity'];
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  sx?: SxProps<Theme>;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  severity = 'error',
  onClose,
  autoClose = false,
  autoCloseTime = 5000,
  sx
}) => {
  const [open, setOpen] = useState(true);

  // Handle auto-close
  React.useEffect(() => {
    if (autoClose && open) {
      const timer = setTimeout(() => {
        setOpen(false);
        if (onClose) onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose, open]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={sx}
      >
        {message}
      </Alert>
    </Collapse>
  );
};

export default AlertMessage;
