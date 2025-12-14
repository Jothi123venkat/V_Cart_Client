import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import { Add, LocalOffer } from '@mui/icons-material';
import Swal from 'sweetalert2';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([
    { id: 1, code: 'SAVE20', discount: 20, type: 'Percentage', active: true },
    { id: 2, code: 'FLAT50', discount: 50, type: 'Fixed', active: true }
  ]);
  const [open, setOpen] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discount: '',
    type: 'Percentage'
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewPromo({ code: '', discount: '', type: 'Percentage' });
  };

  const handleCreate = () => {
    if (!newPromo.code || !newPromo.discount) {
      Swal.fire('Error', 'Please fill all fields', 'error');
      return;
    }

    const promotion = {
      id: Date.now(),
      ...newPromo,
      discount: Number(newPromo.discount),
      active: true
    };

    setPromotions([...promotions, promotion]);
    Swal.fire('Success!', 'Promotion created successfully', 'success');
    handleClose();
  };

  const toggleActive = (id) => {
    setPromotions(promotions.map(promo =>
      promo.id === id ? { ...promo, active: !promo.active } : promo
    ));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Promotions & Coupons</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Create Promotion
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Code</strong></TableCell>
                  <TableCell><strong>Discount</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell>
                      <Chip icon={<LocalOffer />} label={promo.code} color="primary" />
                    </TableCell>
                    <TableCell>
                      {promo.type === 'Percentage' ? `${promo.discount}%` : `$${promo.discount}`}
                    </TableCell>
                    <TableCell>{promo.type}</TableCell>
                    <TableCell>
                      <Chip 
                        label={promo.active ? 'Active' : 'Inactive'} 
                        color={promo.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => toggleActive(promo.id)}
                      >
                        {promo.active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Promotion Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Promotion</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="mt-1">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coupon Code"
                value={newPromo.code}
                onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                placeholder="e.g., SAVE20"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Discount Value"
                type="number"
                value={newPromo.discount}
                onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={newPromo.type}
                onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed">Fixed Amount ($)</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromotionManagement;
