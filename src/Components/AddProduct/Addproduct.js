import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Container, TextField, Grid, Box, Typography } from "@mui/material";
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

const Addproduct = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    register
  } = useForm();
  
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open2, setOpen2] = React.useState(false);

  // Dialog Handlers
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };
  const handleClickOpen2 = () => setOpen2(true);
  const handleClose2 = () => {
    console.log('Closing edit dialog and resetting form');
    setOpen2(false);
    setSelectedProduct(null);
    reset();
  };

  // CRUD Operations
  const onsubmit = async (data) => {
    console.log('Add product called with data:', data);
    try {
      const productData = {
        productname: data.productname,
        productdescription: data.productdescription,
        price: Number(data.price),
        stock: Number(data.stock) || 0,
        category: data.category || "Uncategorized",
        ImageURL: data.ImageURL || ""
      };
      
      console.log('Adding product:', productData);
      await addProduct(productData);
      
      Swal.fire({
        title: 'Success!',
        text: 'Product added successfully',
        icon: 'success',
        timer: 2000
      });
      
      reset();
      handleClose();
    } catch (error) {
      console.error('Add product failed:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add product',
        icon: 'error'
      });
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
    setValue("updateproductname", product.productname);
    setValue("updateproductDescription", product.productdescription);
    setValue("updateprice", product.price);
    setValue("updatecategory", product.category || "Uncategorized");
    setValue("ImageURL", product.ImageURL);
    
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setValue("ImageURL", reader.result);
        // console.log("Image set");
      };
    }
  };

  if(loading) return <div>Loading Admin Panel...</div>;

  return (
    <div>
      <div className="d-flex justify-content-end mt-3 p-3">
        <Button variant="contained" onClick={handleClickOpen}>
          Add Product
        </Button>
      </div>

      <Container className=" mt-3 ">
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
                  <TableCell>${row.price}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color={row.stock === 0 ? 'error' : row.stock <= 10 ? 'warning.main' : 'success.main'}>
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
          <form onSubmit={handleSubmit(onsubmit)} className="mt-4">
            <Controller
              control={control}
              name="productname"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField 
                    {...field} 
                    label="Product Name" 
                    fullWidth 
                    error={!!errors.productname}
                    helperText={errors.productname?.message}
                />
              )}
            />
            <div className="mt-3">
            <Controller
              control={control}
              name="productdescription"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <TextField 
                    {...field} 
                    label="Description" 
                    fullWidth 
                    error={!!errors.productdescription}
                    helperText={errors.productdescription?.message}
                />
              )}
            />
            </div>
            
            <Grid container spacing={2} className="mt-3">
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="price"
                  rules={{ required: "Price is required" }}
                  render={({ field }) => (
                    <TextField 
                        {...field} 
                        type="number" 
                        label="Price" 
                        fullWidth 
                        error={!!errors.price}
                        helperText={errors.price?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  {...register("stock", { required: true, min: 0 })}
                  error={!!errors.stock}
                  helperText={errors.stock ? "Stock is required and must be ≥ 0" : ""}
                  inputProps={{ min: 0 }}
                  defaultValue={0}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  {...register("category")}
                  placeholder="e.g., Electronics, Clothing"
                  defaultValue="Uncategorized"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                    accept="image/*"
                    type="file"
                    onChange={handleImageUpload}
                />
              </Grid>
            </Grid>
            
            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="contained">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Product Dialog */}
      <Dialog open={open2} onClose={handleClose2} fullWidth maxWidth="md">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit2)}>
            <Grid container spacing={2} className="mt-2">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  {...register("updateproductname", { required: true })}
                  error={!!errors.updateproductname}
                  helperText={errors.updateproductname ? "Product name is required" : ""}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Description"
                  multiline
                  rows={3}
                  {...register("updateproductDescription", { required: true })}
                  error={!!errors.updateproductDescription}
                  helperText={errors.updateproductDescription ? "Description is required" : ""}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price"
                  {...register("updateprice", { required: true })}
                  error={!!errors.updateprice}
                  helperText={errors.updateprice ? "Price is required" : ""}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  {...register("updatecategory")}
                  placeholder="e.g., Electronics, Clothing"
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
                    onChange={handleImageUpload}
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

export default Addproduct;
