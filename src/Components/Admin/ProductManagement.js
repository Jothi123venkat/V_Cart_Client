import React, { useState, useMemo } from "react";
import {
  Button,
  Container,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  Card,
  CardContent,
  CircularProgress
} from "@mui/material";
import { 
  Delete, 
  Edit, 
  Add, 
  Search, 
  Inventory, 
  CloudUpload,
  Category,
  FilterList,
  MoreVert,
  Image as ImageIcon,
  CheckCircle,
  Warning
} from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useProducts } from "../../context/ProductContext";
import Swal from 'sweetalert2';

const ProductManagement = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    control: controlAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
    register: registerAdd,
    setValue: setValueAdd
  } = useForm({
    defaultValues: {
        productname: "",
        productdescription: "",
        price: "",
        stock: 0,
        category: "",
        material: "",
        colors: "",
        sizes: ""
    }
  });

  const {
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    setValue: setValueEdit,
    reset: resetEdit,
    register: registerEdit
  } = useForm();

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
        p.productname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => { resetAdd(); setOpenAdd(false); };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setValueEdit("productname", product.productname);
    setValueEdit("productdescription", product.productdescription);
    setValueEdit("price", product.price);
    setValueEdit("stock", product.stock);
    setValueEdit("category", product.category);
    setValueEdit("ImageURL", product.ImageURL);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => { setSelectedProduct(null); resetEdit(); setOpenEdit(false); };

  const onAddSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        colors: typeof data.colors === 'string' ? data.colors.split(',').map(c => c.trim()) : data.colors,
        sizes: typeof data.sizes === 'string' ? data.sizes.split(',').map(s => s.trim()) : data.sizes
      };
      await addProduct(formattedData);
      Swal.fire('Success', 'Product added successfully', 'success');
      handleCloseAdd();
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to add product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const updates = {
          ...data,
          price: Number(data.price),
          stock: Number(data.stock)
      };
      await updateProduct(selectedProduct._id, updates);
      Swal.fire('Updated', 'Product updated successfully', 'success');
      handleCloseEdit();
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to update product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Product will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        Swal.fire('Deleted!', 'Product has been removed.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete product', 'error');
      }
    }
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'add') setValueAdd("ImageURL", reader.result);
        else setValueEdit("ImageURL", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStockChip = (stock) => {
    if (stock === 0) return <Chip label="Out of Stock" size="small" color="error" variant="outlined" />;
    if (stock <= 5) return <Chip label={`Low: ${stock}`} size="small" color="warning" variant="outlined" />;
    return <Chip label={`${stock} In Stock`} size="small" color="success" variant="outlined" />;
  };

  if (loading && products.length === 0) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
  );

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight="bold">Product Inventory</Typography>
            <Typography variant="body2" color="text.secondary">Manage your store's catalog and stock levels.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ borderRadius: 2, px: 3 }}>
            Add Product
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
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
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fbfbfb' }}>
            <TableRow>
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
                    <Avatar variant="rounded" src={p.ImageURL} sx={{ width: 48, height: 48, bgcolor: 'action.hover' }}>
                        <ImageIcon color="action" />
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight="bold">{p.productname}</Typography>
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
                    <Typography variant="subtitle2" fontWeight="bold">₹{p.price}</Typography>
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
      <Dialog open={openAdd} onClose={handleCloseAdd} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Product</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmitAdd(onAddSubmit)}>
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
                    <Box sx={{ border: '2px dashed #eee', p: 3, textAlign: 'center', borderRadius: 2 }}>
                        <input accept="image/*" type="file" id="add-img" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, 'add')} />
                        <label htmlFor="add-img">
                            <Button component="span" startIcon={<CloudUpload />} sx={{ mb: 1 }}>Upload Product Image</Button>
                        </label>
                        <Typography variant="caption" color="text.secondary" display="block">Supported: JPG, PNG, WEBP (Max 2MB)</Typography>
                        <Controller
                            name="ImageURL"
                            control={controlAdd}
                            render={({ field }) => field.value ? <Box sx={{ mt: 2 }}><img src={field.value} alt="Preview" style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }} /></Box> : null}
                        />
                    </Box>
                </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#fbfbfb' }}>
            <Button onClick={handleCloseAdd}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitAdd(onAddSubmit)} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Create Product"}
            </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Product</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmitEdit(onEditSubmit)}>
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
                    <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 2 }}>
                        <Typography variant="caption" display="block" gutterBottom>Change Product Image</Typography>
                        <input accept="image/*" type="file" onChange={(e) => handleImageUpload(e, 'edit')} />
                    </Box>
                </Stack>
            </form>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitEdit(onEditSubmit)} disabled={isSubmitting}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;

