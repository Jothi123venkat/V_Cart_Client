import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Divider,
  Paper,
  IconButton
} from '@mui/material';
import { 
  Close as CloseIcon, 
  LocalShipping, 
  Inventory, 
  CheckCircle, 
  Cancel as CancelIcon,
  Schedule,
  AssignmentReturn
} from '@mui/icons-material';

const TrackOrder = ({ open, onClose, order }) => {
  if (!order) return null;

  const steps = ['Processing', 'Shipped', 'Delivered'];
  const returnStatuses = ['Return Requested', 'Returned', 'Return Rejected'];
  
  if (returnStatuses.includes(order.status)) {
    steps.push('Return Requested');
    if (order.status === 'Returned') steps.push('Returned');
    if (order.status === 'Return Rejected') steps.push('Return Rejected');
  }
  
  const getActiveStep = (status) => {
    switch (status) {
      case 'Processing': return 0;
      case 'Shipped': return 1;
      case 'Delivered': return 2;
      case 'Return Requested': return 3;
      case 'Returned': 
      case 'Return Rejected': return 4;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const activeStep = getActiveStep(order.status);
  const isCancelled = order.status === 'Cancelled';

  const getStepIcon = (index, label) => {
    if (label === 'Return Requested' || label === 'Returned' || label === 'Return Rejected') {
        return <AssignmentReturn />;
    }
    switch (index) {
      case 0: return <Inventory />;
      case 1: return <LocalShipping />;
      case 2: return <CheckCircle />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth borderRadius={2}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Track Order #{order._id.substring(0, 10)}</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 4 }}>
        {isCancelled ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CancelIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" color="error">Order Cancelled</Typography>
            <Typography variant="body2" color="text.secondary">
              This order was cancelled on {new Date(order.date).toLocaleDateString()}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    error={label === 'Return Rejected'}
                    StepIconComponent={() => (
                        <Box sx={{ 
                            color: label === 'Return Rejected' ? 'error.main' : (activeStep >= index ? 'primary.main' : 'grey.400'),
                            display: 'flex'
                        }}>
                            {getStepIcon(index, label)}
                        </Box>
                    )}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Paper variant="outlined" sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              {order.status === 'Return Rejected' && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'error.lighter', border: '1px solid', borderColor: 'error.main', borderRadius: 1 }}>
                      <Typography variant="body2" color="error" fontWeight="bold">
                          Return Request Rejected
                      </Typography>
                      <Typography variant="caption" color="error">
                          Your request was not approved by our quality team.
                      </Typography>
                  </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Schedule color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight="bold">Status Update</Typography>
              </Box>
              
              <Typography variant="body2" gutterBottom>
                <strong>Current Status:</strong> {order.status}
              </Typography>
              {order.returnReason && (
                <Typography variant="body2" gutterBottom>
                  <strong>Return Reason:</strong> {order.returnReason}
                </Typography>
              )}
              <Typography variant="body2" gutterBottom>
                <strong>Estimated Delivery:</strong> {steps.includes(order.status) && activeStep >= 2 ? 'Delivered' : 'Pending'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocalShipping color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight="bold">Shipping Details</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {order.shippingInfo?.name}<br />
                {order.shippingInfo?.address}, {order.shippingInfo?.city}<br />
                {order.shippingInfo?.zipCode}
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrackOrder;
