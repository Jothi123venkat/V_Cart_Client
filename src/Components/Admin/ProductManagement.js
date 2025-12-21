import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Container, TextField, Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Delete, Update } from "@mui/icons-material";
import CreateIcon from "@mui/icons-material/Create";
import { useProducts } from "../../context/ProductContext";
import Swal from 'sweetalert2';

const ProductManagement = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  
  // Separate forms for Add and Update
  const {
    control: controlAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    setValue: setValueAdd,
    reset: resetAdd,
    register: registerAdd
  } = useForm();

  const {
    control: controlUpdate, // Not used much if using register
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    setValue: setValueUpdate,
    reset: resetUpdate,
    register: registerUpdate
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open2, setOpen2] = React.useState(false);

  // Dialog Handlers
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetAdd();
  };
  const handleClickOpen2 = () => setOpen2(true);
  const handleClose2 = () => {
    console.log('Closing edit dialog and resetting form');
    setOpen2(false);
    setSelectedProduct(null);
    resetUpdate();
  };

  // Register ImageURL for Add Form
  React.useEffect(() => {
    registerAdd("ImageURL", { required: "Product Image is required" });
  }, [registerAdd]);

  const onErrorAdd = (errors) => {
      console.error("Form Validation Errors:", errors);
      Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          text: 'Please check the form fields',
      });
  };

  const onsubmit = async (data) => {
    setIsSubmitting(true);
    console.log('Add product called with data:', data);
    try {
      const productData = {
        productname: data.productname,
        productdescription: data.productdescription,
        price: Number(data.price),
        stock: Number(data.stock) || 0,
        category: data.category || "Uncategorized",
        ImageURL: data.ImageURL || "",
        material: data.material || "",
        colors: data.colors ? (typeof data.colors === 'string' ? data.colors.split(',') : data.colors) : [],
        sizes: data.sizes ? (typeof data.sizes === 'string' ? data.sizes.split(',') : data.sizes) : []
      };
      
      // Clean up arrays
      if(Array.isArray(productData.colors)) productData.colors = productData.colors.map(c => c.trim());
      if(Array.isArray(productData.sizes)) productData.sizes = productData.sizes.map(s => s.trim());
      
      console.log('Adding product:', productData);
      await addProduct(productData);
      
      Swal.fire({
        title: 'Success!',
        text: 'Product added successfully',
        icon: 'success',
        timer: 2000
      });
      
      resetAdd();
      handleClose();
    } catch (error) {
      console.error('Add product failed:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add product. ' + (error.response?.data?.message || error.message),
        icon: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handledelte = async (id) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
        await deleteProduct(id);
    }
  };

  const handleupdate = (product) => {
    console.log('=== EDIT PRODUCT CLICKED ===');
    console.log('Product to edit:', product);
    
    setSelectedProduct(product);
    setValueUpdate("updateproductname", product.productname);
    setValueUpdate("updateproductDescription", product.productdescription);
    setValueUpdate("updateprice", product.price);
    setValueUpdate("updatecategory", product.category || "Uncategorized");
    setValueUpdate("ImageURL", product.ImageURL);
    
    console.log('Form values set, opening dialog');
    handleClickOpen2();
  };

  const onSubmit2 = async (data) => {
    console.log('=== UPDATE PRODUCT STARTED ===');
    console.log('Form data received:', data);
    console.log('Selected product:', selectedProduct);
    
    try {
      // Validate we have a product selected
      if (!selectedProduct || !selectedProduct._id) {
        console.error('No product selected!');
        Swal.fire('Error', 'No product selected', 'error');
        return;
      }

      // Build update object
      const updates = {
        productname: data.updateproductname,
        productdescription: data.updateproductDescription,
        price: Number(data.updateprice),
        category: data.updatecategory || "Uncategorized",
        ImageURL: data.ImageURL || selectedProduct.ImageURL
      };
      
      console.log('Sending update for product ID:', selectedProduct._id);
      console.log('Update data:', updates);
      
      // Call update function
      const result = await updateProduct(selectedProduct._id, updates);
      console.log('Update result:', result);
      
      // Show success message
      await Swal.fire({
        title: 'Updated!',
        text: 'Product has been updated successfully',
        icon: 'success',
        timer: 2000
      });
      
      console.log('=== UPDATE PRODUCT COMPLETED ===');
      
      // Close dialog (which will reset form)
      handleClose2();
    } catch (error) {
      console.error('=== UPDATE PRODUCT FAILED ===');
      console.error('Error details:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to update product',
        icon: 'error'
      });
    }
  };

  const handleImageUploadAdd = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
         Swal.fire('Error', 'Image size must be less than 2MB', 'error');
         event.target.value = null; 
         return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setValueAdd("ImageURL", reader.result, { shouldValidate: true });
      };
    }
  };

  const handleImageUploadUpdate = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
         Swal.fire('Error', 'Image size must be less than 2MB', 'error');
         event.target.value = null; 
         return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setValueUpdate("ImageURL", reader.result, { shouldValidate: true });
      };
    }
  };

  if(loading) return <div>Loading Admin Panel...</div>;

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} p={3}>
        <Typography variant="h4" fontWeight="bold">Product Inventory</Typography>
        <Button variant="contained" onClick={handleClickOpen} startIcon={<CreateIcon />}>
          Add New Product
        </Button>
      </Box>

      <Container className=" mt-3 ">
          {/* ... Table Same ... */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>NO</TableCell>
                <TableCell>ProductName</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((row, index) => (
                <TableRow
                  key={row._id || index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{row.productname}</TableCell>
                  <TableCell>{row.productdescription}</TableCell>
                  <TableCell>₹{row.price}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color={row.stock === 0 ? 'error' : row.stock <= 10 ? 'warning.main' : 'success.main'} >
                      {row.stock || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.category || 'Uncategorized'}</TableCell>

                  <TableCell>
                    <img
                      src={row.ImageURL}
                      alt="img"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handledelte(row._id)} color="error"><Delete /></Button>
                    <Button onClick={() => handleupdate(row)} color="primary"><CreateIcon /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>


      {/* Add Product Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle className="text-center">Product Upload</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitAdd(onsubmit, onErrorAdd)} className="mt-4">
             {/* ... Form Fields Same ... */}
             
            <Controller
              control={controlAdd}
              name="productname"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField 
                    {...field} 
                    label="Product Name" 
                    fullWidth 
                    error={!!errorsAdd.productname}
                    helperText={errorsAdd.productname?.message}
                />
              )}
            />
            <div className="mt-3">
            <Controller
              control={controlAdd}
              name="productdescription"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <TextField 
                    {...field} 
                    label="Description" 
                    fullWidth 
                    error={!!errorsAdd.productdescription}
                    helperText={errorsAdd.productdescription?.message}
                />
              )}
            />
            </div>
            
            <Grid container spacing={2} className="mt-3">
              <Grid item xs={12} sm={6}>
                <Controller
                  control={controlAdd}
                  name="price"
                  rules={{ required: "Price is required" }}
                  render={({ field }) => (
                    <TextField 
                        {...field} 
                        type="number" 
                        label="Price" 
                        fullWidth 
                        error={!!errorsAdd.price}
                        helperText={errorsAdd.price?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  {...registerAdd("stock", { required: true, min: 0 })}
                  error={!!errorsAdd.stock}
                  helperText={errorsAdd.stock ? "Stock is required and must be ≥ 0" : ""}
                  inputProps={{ min: 0 }}
                  defaultValue={0}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={controlAdd}
                  name="category"
                  rules={{ required: "Category is required" }}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errorsAdd.category}>
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        {categories.map((cat) => (
                          <MenuItem key={cat._id} value={cat.name}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errorsAdd.category && <FormHelperText>{errorsAdd.category.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Material"
                  {...registerAdd("material", { required: "Material is required" })}
                  error={!!errorsAdd.material}
                  helperText={errorsAdd.material?.message}
                  placeholder="e.g., Silk, Cotton"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Colors (comma separated)"
                  {...registerAdd("colors", { required: "Colors are required" })}
                  error={!!errorsAdd.colors}
                  helperText={errorsAdd.colors?.message}
                  placeholder="e.g., Red, Blue, Gold"
                />
              </Grid>
               <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sizes (comma separated)"
                  {...registerAdd("sizes", { required: "Sizes are required" })}
                  error={!!errorsAdd.sizes}
                  helperText={errorsAdd.sizes?.message}
                  placeholder="e.g., S, M, L, 50m, 100m"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <input
                      accept="image/*"
                      type="file"
                      onChange={handleImageUploadAdd}
                  />
                  {errorsAdd.ImageURL && <Typography variant="caption" color="error">{errorsAdd.ImageURL.message}</Typography>}
                </Box>
              </Grid>
            </Grid>
            
            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Product Dialog */}
      <Dialog open={open2} onClose={handleClose2} fullWidth maxWidth="md">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitUpdate(onSubmit2)}>
             {/* ... Form Fields Same ... */}
            <Grid container spacing={2} className="mt-2">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  {...registerUpdate("updateproductname", { required: true })}
                  error={!!errorsUpdate.updateproductname}
                  helperText={errorsUpdate.updateproductname ? "Product name is required" : ""}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Description"
                  multiline
                  rows={3}
                  {...registerUpdate("updateproductDescription", { required: true })}
                  error={!!errorsUpdate.updateproductDescription}
                  helperText={errorsUpdate.updateproductDescription ? "Description is required" : ""}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price"
                  {...registerUpdate("updateprice", { required: true })}
                  error={!!errorsUpdate.updateprice}
                  helperText={errorsUpdate.updateprice ? "Price is required" : ""}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  control={controlUpdate}
                  name="updatecategory"
                  rules={{ required: "Category is required" }}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errorsUpdate.updatecategory}>
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        {categories.map((cat) => (
                          <MenuItem key={cat._id} value={cat.name}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errorsUpdate.updatecategory && <FormHelperText>{errorsUpdate.updatecategory.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" display="block" gutterBottom>
                    Product Image
                  </Typography>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={handleImageUploadUpdate}
                  />
                </Box>
              </Grid>
            </Grid>

            <div className="d-flex justify-content-end mt-3 gap-2">
              <Button onClick={handleClose2} variant="outlined">Cancel</Button>
              <Button 
                type="submit" 
                variant="contained"
                color="primary"
              >
                UPDATE PRODUCT
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
