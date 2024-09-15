import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastNotification = ({open, message, severity, hideToast}) => {
  return (
    <div>
      <Snackbar open={open} autoHideDuration={3000} onClose={hideToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={severity} sx={{ width: '100%' }} onClose={hideToast}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ToastNotification;