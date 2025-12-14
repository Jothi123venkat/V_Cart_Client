import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid
} from '@mui/material';
import {
  Edit,
  Warning,
  CheckCircle,
  Block,
  Inventory2
} from '@mui/icons-material';
import { useProducts } from '../../context/ProductContext';
import Swal from 'sweetalert2';

const InventoryManagement = () => {
  const { products, updateProduct, refreshProducts } = useProducts();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockInput, setStockInput] = useState(0);
  const [lowStockThreshold] = useState(10);

  useEffect(() => {
    refreshProducts();
  }, []);

  const handleEditStock = (product) => {
    setSelectedProduct(product);
    setStockInput(product.stock || 0);
    setOpenDialog(true);
  };

  const handleUpdateStock = async () => {
    if (stockInput < 0) {
      Swal.fire('Error', 'Stock cannot be negative', 'error');
      return;
    }

    console.log('Updating stock for:', selectedProduct.productname, 'to:', stockInput);
    try {
      await updateProduct(selectedProduct._id, {
        ...selectedProduct,
        stock: parseInt(stockInput)
      });

      Swal.fire({
        title: 'Stock Updated!',
        text: `${selectedProduct.productname} stock updated to ${stockInput}`,
        icon: 'success',
        timer: 2000
      });

      setOpenDialog(false);
      await refreshProducts();
      console.log('Stock update successful');
    } catch (error) {
      console.error('Stock update failed:', error);
      Swal.fire('Error', 'Failed to update stock', 'error');
    }
  };

  const handleMarkOutOfStock = async (product) => {
    Swal.fire({
      title: 'Mark as Out of Stock?',
      text: `This will set ${product.productname} stock to 0`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, mark out of stock'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateProduct(product._id, { ...product, stock: 0 });
        Swal.fire('Updated!', 'Product marked as out of stock', 'success');
        refreshProducts();
      }
    });
  };

  const handleQuickStock = async (product, amount) => {
    const newStock = (product.stock || 0) + amount;
    if (newStock < 0) return;

    console.log('Quick stock update:', product.productname, 'from', product.stock, 'to', newStock);
    try {
      await updateProduct(product._id, { ...product, stock: newStock });
      await refreshProducts();
      Swal.fire({
        title: 'Updated!',
        text: `Stock updated to ${newStock}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Quick stock update failed:', error);
      Swal.fire('Error', 'Failed to update stock', 'error');
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'error', icon: <Block /> };
    if (stock <= lowStockThreshold) return { label: 'Low Stock', color: 'warning', icon: <Warning /> };
    return { label: 'In Stock', color: 'success', icon: <CheckCircle /> };
  };

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" className="mb-4">
        <Inventory2 /> Inventory Management
      </Typography>

      {/* Alerts */}
      <Grid container spacing={2} className="mb-4">
        {lowStockProducts.length > 0 && (
          <Grid item xs={12} md={6}>
            <Alert severity="warning" icon={<Warning />}>
              <strong>{lowStockProducts.length} products</strong> have low stock (≤{lowStockThreshold} units)
            </Alert>
          </Grid>
        )}
        {outOfStockProducts.length > 0 && (
          <Grid item xs={12} md={6}>
            <Alert severity="error" icon={<Block />}>
              <strong>{outOfStockProducts.length} products</strong> are out of stock
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Inventory Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="mb-3">Product Inventory</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Product</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Stock</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Quick Actions</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => {
                  const status = getStockStatus(product.stock || 0);
                  return (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <img
                            src={product.ImageURL}
                            alt={product.productname}
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                          />
                          <Typography variant="body2">{product.productname}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{product.category || 'Uncategorized'}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight="bold">
                          {product.stock || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleQuickStock(product, -1)}
                            disabled={product.stock === 0}
                          >
                            -1
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleQuickStock(product, 1)}
                          >
                            +1
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleQuickStock(product, 10)}
                          >
                            +10
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEditStock(product)}
                          >
                            <Edit />
                          </IconButton>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleMarkOutOfStock(product)}
                            disabled={product.stock === 0}
                          >
                            Out of Stock
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit Stock Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Stock - {selectedProduct?.productname}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" className="mb-2">
              Current Stock: <strong>{selectedProduct?.stock || 0}</strong> units
            </Typography>
            <TextField
              fullWidth
              type="number"
              label="New Stock Quantity"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              inputProps={{ min: 0 }}
              helperText="Enter the new stock quantity"
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button size="small" variant="outlined" onClick={() => setStockInput(0)}>
                Set to 0
              </Button>
              <Button size="small" variant="outlined" onClick={() => setStockInput(10)}>
                Set to 10
              </Button>
              <Button size="small" variant="outlined" onClick={() => setStockInput(50)}>
                Set to 50
              </Button>
              <Button size="small" variant="outlined" onClick={() => setStockInput(100)}>
                Set to 100
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateStock} variant="contained">
            Update Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryManagement;
