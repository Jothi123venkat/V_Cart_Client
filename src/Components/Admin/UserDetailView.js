import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, Typography, Grid, 
  List, ListItem, ListItemText, Divider, Chip, Box, Tabs, Tab
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const UserDetailView = ({ open, onClose, user }) => {
  const [tabIndex, setTabIndex] = useState(0);

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        User Details: {user.name}
        <Box mt={1}>
           <Chip 
             label={user.status || 'Active'} 
             color={user.status === 'suspended' ? 'error' : 'success'} 
             size="small" 
            />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Profile" />
          <Tab label="Activity" />
          <Tab label="Orders" />
        </Tabs>

        {tabIndex === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="body1" gutterBottom>{user.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Phone</Typography>
              <Typography variant="body1" gutterBottom>{user.phone || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Joined Date</Typography>
                <Typography variant="body1" gutterBottom>{new Date(user.createdAt).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" gutterBottom>Saved Addresses</Typography>
                {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr, idx) => (
                        <Box key={idx} mb={1}>
                            <Typography variant="subtitle2">{addr.label} {addr.isDefault && <Chip label="Default" size="small" />}</Typography>
                            <Typography variant="body2">{addr.street}, {addr.city}, {addr.state} {addr.zip}</Typography>
                        </Box>
                    ))
                ) : <Typography>No addresses saved.</Typography>}
            </Grid>
          </Grid>
        )}

        {tabIndex === 1 && (
            <List>
                {user.activityLog && user.activityLog.length > 0 ? (
                    user.activityLog.map((log, index) => (
                        <ListItem key={index}>
                            <ListItemText 
                                primary={log.action} 
                                secondary={`${new Date(log.date).toLocaleString()} - ${log.details}`} 
                            />
                        </ListItem>
                    ))
                ) : <Typography p={2}>No activity recorded.</Typography>}
            </List>
        )}

        {tabIndex === 2 && (
            <Typography p={2}>Order history viewing coming soon integrated with Order Management.</Typography>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default UserDetailView;
