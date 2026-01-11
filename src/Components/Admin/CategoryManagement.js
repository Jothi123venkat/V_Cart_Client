import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import Swal from 'sweetalert2';

const CategoryManagement = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/categories`);
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
          setCurrentCategory({ name: '' });
      }
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
      setCurrentCategory({ name: '' });
  };

  const handleSave = async () => {
    if (!currentCategory.name.trim()) {
      Swal.fire('Error', 'Category name is required', 'error');
      return;
    }

    try {
        const token = localStorage.getItem('vcart_token');
        const config = { headers: { 'x-auth-token': token } };

        if (editMode) {
          await axios.put(`${API_BASE_URL}/api/categories/${currentCategory._id}`, { name: currentCategory.name }, config);
          Swal.fire('Success', 'Category updated successfully', 'success');
        } else {
          await axios.post(`${API_BASE_URL}/api/categories`, { name: currentCategory.name }, config);
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
            const token = localStorage.getItem('vcart_token');
            await axios.delete(`${API_BASE_URL}/api/categories/${id}`, { headers: { 'x-auth-token': token } });
            fetchCategories();
            Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        } catch(err) {
            Swal.fire('Error', 'Failed to delete', 'error');
        }
      }
    });
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>Category Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Category
        </Button>
      </Box>

      <Card sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
        <CardContent>
          <TableContainer component={Paper} variant="outlined" sx={{ borderColor: theme.palette.divider }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
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
                      <Chip label={`${0} products`} size="small" variant="outlined" /> {/* Placeholder count */}
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ color: theme.palette.text.primary }}>{editMode ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={currentCategory.name}
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
            sx={{ mt: 1 }}
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
