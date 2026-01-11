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
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { Save, Cancel, Edit } from '@mui/icons-material';
import { useProducts } from '../../context/ProductContext';
import Swal from 'sweetalert2';
import { useTheme } from '@mui/material/styles';

const InventoryManagement = () => {
  const theme = useTheme();
  const { products, updateProduct } = useProducts();
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditStock(product.stock);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditStock(0);
  };

  const handleSave = async (id) => {
    try {
        await updateProduct(id, { stock: Number(editStock) });
        setEditingId(null);
        Swal.fire({
            icon: 'success',
            title: 'Stock Updated',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    } catch (error) {
        Swal.fire('Error', 'Failed to update stock', 'error');
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => 
    p.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p._id && p._id.includes(searchTerm))
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: theme.palette.text.primary }}>
        Inventory Status
      </Typography>

      <Card sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
        <CardContent>
            <TextField 
                placeholder="Search..." 
                size="small" 
                sx={{ mb: 2, width: 300 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          <TableContainer component={Paper} variant="outlined" sx={{ borderColor: theme.palette.divider }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                  <TableCell><strong>Product</strong></TableCell>
                  <TableCell><strong>SKU / ID</strong></TableCell>
                  <TableCell><strong>Current Stock</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img src={product.ImageURL} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                            <Box>
                                <Typography variant="body2" fontWeight="bold">{product.productname}</Typography>
                                <Typography variant="caption" color="text.secondary">{product.category}</Typography>
                            </Box>
                        </Box>
                    </TableCell>
                    <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {product._id.substring(0, 8)}...
                        </Typography>
                    </TableCell>
                    <TableCell>
                        {editingId === product._id ? (
                            <TextField 
                                type="number" 
                                size="small" 
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                                sx={{ width: 100 }}
                                autoFocus
                            />
                        ) : (
                            <Typography variant="body1">{product.stock}</Typography>
                        )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'} 
                        color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                        {editingId === product._id ? (
                            <Box>
                                <IconButton color="success" onClick={() => handleSave(product._id)}><Save /></IconButton>
                                <IconButton color="error" onClick={handleCancel}><Cancel /></IconButton>
                            </Box>
                        ) : (
                            <IconButton onClick={() => handleEditClick(product)}>
                                <Edit fontSize="small" />
                            </IconButton>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InventoryManagement;
