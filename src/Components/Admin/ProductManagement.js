import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Image as ImageIcon,
  Category,
  Edit,
  Delete,
  CloudUpload
} from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import Swal from 'sweetalert2';
import { useForm, Controller } from 'react-hook-form';

const ProductManagement = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog States
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Forms
  const { register: registerAdd, handleSubmit: handleSubmitAdd, control: controlAdd, reset: resetAdd, formState: { errors: errorsAdd, isSubmitting: isSubmittingAdd }, setValue: setValueAdd } = useForm({
      defaultValues: {
          productname: '', category: '', productdescription: '', price: '', stock: '', material: '', colors: '', sizes: '', ImageURL: ''
      }
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, control: controlEdit, reset: resetEdit, formState: { isSubmitting: isSubmittingEdit }, setValue: setValueEdit } = useForm();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.products.getAll}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchCategories = async () => {
      try {
          // Assuming a categories endpoint exists, or we extract from products unique values
          // Ideally use a dedicated endpoint if available
          const res = await axios.get(`${API_BASE_URL}/api/categories`); 
          setCategories(res.data);
      } catch(err) {
          console.log("Categories fetch failed or endpoint missing, using defaults implies manual entry");
          // Fallback or ignore
      }
  };

  const handleOpenAdd = () => {
      resetAdd();
      setOpenAdd(true);
  };

  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenEdit = (product) => {
      setCurrentProduct(product);
      resetEdit(product); // Reset form with product data
      setOpenEdit(true);
  };

  const handleCloseEdit = () => {
      setOpenEdit(false);
      setCurrentProduct(null);
  };

  const onAddSubmit = async (data) => {
      try {
          const token = localStorage.getItem('vcart_token');
          await axios.post(`${API_BASE_URL}${API_ENDPOINTS.products.add}`, data, {
              headers: { 'x-auth-token': token }
          });
          Swal.fire('Success', 'Product added successfully', 'success');
          handleCloseAdd();
          fetchProducts();
      } catch(err) {
          Swal.fire('Error', 'Failed to add product', 'error');
      }
  };

  const onEditSubmit = async (data) => {
      try {
          const token = localStorage.getItem('vcart_token');
          await axios.put(`${API_BASE_URL}${API_ENDPOINTS.products.update(currentProduct._id)}`, data, {
              headers: { 'x-auth-token': token }
          });
          Swal.fire('Success', 'Product updated successfully', 'success');
          handleCloseEdit();
          fetchProducts();
      } catch(err) {
          Swal.fire('Error', 'Failed to update product', 'error');
      }
  };

  const handleDelete = async (id) => {
      const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
          try {
              const token = localStorage.getItem('vcart_token');
              await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.products.delete(id)}`, {
                  headers: { 'x-auth-token': token }
              });
              Swal.fire('Deleted!', 'Product has been deleted.', 'success');
              fetchProducts();
          } catch(err) {
              Swal.fire('Error', 'Failed to delete product', 'error');
          }
      }
  };

  const handleImageUpload = async (e, mode) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      // Fallback preset
      formData.append('upload_preset', 'vcart_preset'); 

      try {
          // Attempting a generic upload to cloudinary if env provided, or alert user
          // For now, prompt user to use URL or assume backend upload
          // Since we don't have the config, we'll try a common endpoint or assume URL entry
          
          /* 
            const res = await axios.post('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', formData);
            const url = res.data.secure_url;
          */
          
          Swal.fire({
              title: 'Image Upload',
              text: 'Image upload configuration is missing. Please enter image URL manually for now.',
              icon: 'info'
          });
          
          // If we had the URL:
          // if (mode === 'add') setValueAdd('ImageURL', url);
          // else setValueEdit('ImageURL', url);

      } catch(err) {
          console.error(err);
          Swal.fire('Error', 'Image upload failed', 'error');
      }
  };

  const getStockChip = (stock) => {
      let color = 'success';
      let label = 'In Stock';
      
      if (stock === 0) {
          color = 'error';
          label = 'Out of Stock';
      } else if (stock < 10) {
          color = 'warning';
          label = 'Low Stock';
      }

      return <Chip label={`${label} (${stock})`} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lower = searchTerm.toLowerCase();
    return products.filter(p => 
        p.productname.toLowerCase().includes(lower) || 
        p.category?.toLowerCase().includes(lower)
    );
  }, [products, searchTerm]);

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>Product Inventory</Typography>
            <Typography variant="body2" color="text.secondary">Manage your store's catalog and stock levels.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ borderRadius: 2, px: 3 }}>
            Add Product
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: theme.shadows[1], bgcolor: theme.palette.background.paper }}>
        <CardContent sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search products by name or category..."
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 500 }}
          />
          <Button variant="outlined" startIcon={<FilterList />} color="inherit">Filter</Button>
        </CardContent>
      </Card>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, bgcolor: theme.palette.background.paper }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Inventory</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow key={p._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar variant="rounded" src={p.ImageURL} sx={{ width: 48, height: 48, bgcolor: theme.palette.action.hover }}>
                        <ImageIcon color="action" />
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight="bold" color={theme.palette.text.primary}>{p.productname}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 200, noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.productdescription}
                        </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                    <Chip label={p.category || 'Uncategorized'} size="small" variant="outlined" icon={<Category sx={{ fontSize: '0.8rem !important' }} />} />
                </TableCell>
                <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold" color={theme.palette.text.primary}>₹{p.price}</Typography>
                </TableCell>
                <TableCell>
                    {getStockChip(p.stock)}
                </TableCell>
                <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(p)}>
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => handleDelete(p._id)}>
                                <Delete fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, bgcolor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Add New Product</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmitAdd(onAddSubmit)} id="add-form">
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="productname"
                        control={controlAdd}
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                            <TextField {...field} label="Product Name" fullWidth error={!!errorsAdd.productname} helperText={errorsAdd.productname?.message} variant="outlined" />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Controller
                            name="category"
                            control={controlAdd}
                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <Select {...field} label="Category">
                                    {categories.map(c => <MenuItem key={c._id} value={c.name}>{c.name}</MenuItem>)}
                                </Select>
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="productdescription"
                        control={controlAdd}
                        rules={{ required: "Description is required" }}
                        render={({ field }) => (
                            <TextField {...field} label="Description" fullWidth multiline rows={3} error={!!errorsAdd.productdescription} helperText={errorsAdd.productdescription?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField label="Price" fullWidth type="number" {...registerAdd("price", { required: true })} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField label="Stock" fullWidth type="number" {...registerAdd("stock", { required: true })} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField label="Material" fullWidth {...registerAdd("material")} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Colors (comma separated)" fullWidth {...registerAdd("colors")} placeholder="Blue, Red, Black" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Sizes (comma separated)" fullWidth {...registerAdd("sizes")} placeholder="S, M, L, XL" />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ border: `2px dashed ${theme.palette.divider}`, p: 3, textAlign: 'center', borderRadius: 2 }}>
                        <input accept="image/*" type="file" id="add-img" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, 'add')} />
                        <label htmlFor="add-img">
                            <Button component="span" startIcon={<CloudUpload />} sx={{ mb: 1 }}>Upload Product Image</Button>
                        </label>
                        <Typography variant="caption" color="text.secondary" display="block">Supported: JPG, PNG, WEBP (Max 2MB)</Typography>
                        <Controller
                            name="ImageURL"
                            control={controlAdd}
                            render={({ field }) => field.value ? <Box sx={{ mt: 2 }}><img src={field.value} alt="Preview" style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }} /></Box> : <TextField {...field} label="Or enter Image URL" fullWidth sx={{mt: 2}} size="small"/>}
                        />
                    </Box>
                </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: theme.palette.action.hover }}>
            <Button onClick={handleCloseAdd}>Cancel</Button>
            <Button variant="contained" type="submit" form="add-form" disabled={isSubmittingAdd}>
                {isSubmittingAdd ? "Processing..." : "Create Product"}
            </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, bgcolor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Product</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmitEdit(onEditSubmit)} id="edit-form">
                <Stack spacing={3}>
                    <TextField label="Product Name" fullWidth {...registerEdit("productname", { required: true })} />
                    <TextField label="Description" fullWidth multiline rows={3} {...registerEdit("productdescription", { required: true })} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}><TextField label="Price" fullWidth type="number" {...registerEdit("price", { required: true })} /></Grid>
                        <Grid item xs={6}><TextField label="Stock" fullWidth type="number" {...registerEdit("stock", { required: true })} /></Grid>
                    </Grid>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Controller
                            name="category"
                            control={controlEdit}
                            render={({ field }) => (
                                <Select {...field} label="Category">
                                    {categories.map(c => <MenuItem key={c._id} value={c.name}>{c.name}</MenuItem>)}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <Box sx={{ border: `1px solid ${theme.palette.divider}`, p: 2, borderRadius: 2 }}>
                        <Typography variant="caption" display="block" gutterBottom>Change Product Image</Typography>
                        <input accept="image/*" type="file" onChange={(e) => handleImageUpload(e, 'edit')} />
                        <Controller
                            name="ImageURL"
                            control={controlEdit}
                            render={({ field }) => field.value && <img src={field.value} alt="Preview" style={{ width: '100%', marginTop: 8, borderRadius: 4 }} />}
                        />
                    </Box>
                </Stack>
            </form>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button variant="contained" type="submit" form="edit-form" disabled={isSubmittingEdit}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;
