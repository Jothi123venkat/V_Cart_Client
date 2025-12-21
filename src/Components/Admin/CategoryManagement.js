import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
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
  IconButton,
  Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data);
    } catch(err) {
        console.error(err);
    }
  };

  const handleOpen = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategory(category);
    } else {
      setEditMode(false);
      setCurrentCategory({ id: null, name: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCategory({ id: null, name: '' });
  };

  const handleSave = async () => {
    if (!currentCategory.name.trim()) {
      Swal.fire('Error', 'Category name is required', 'error');
      return;
    }

    try {
        if (editMode) {
          await axios.put(`http://localhost:5000/api/categories/${currentCategory._id}`, { name: currentCategory.name });
          Swal.fire('Success', 'Category updated successfully', 'success');
        } else {
          await axios.post('http://localhost:5000/api/categories', { name: currentCategory.name });
          Swal.fire('Success', 'Category added successfully', 'success');
        }
        fetchCategories();
        handleClose();
    } catch(err) {
        Swal.fire('Error', 'Failed to save category', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove the category',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            await axios.delete(`http://localhost:5000/api/categories/${id}`);
            fetchCategories();
            Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        } catch(err) {
            Swal.fire('Error', 'Failed to delete', 'error');
        }
      }
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Category Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Category
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Category Name</strong></TableCell>
                  <TableCell><strong>Products</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category._id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Chip label={`- products`} size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpen(category)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(category._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={currentCategory.name}
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
