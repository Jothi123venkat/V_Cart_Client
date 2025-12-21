import React, { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, Avatar, TextField, 
  InputAdornment, IconButton, Tooltip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl,
  Stack
} from '@mui/material';
import { 
  Search, Person, Visibility, Block, CheckCircle, Add, 
  Edit, Delete, AdminPanelSettings, Badge
} from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';
import Swal from 'sweetalert2';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import UserDetailView from './UserDetailView';
import UserEditDialog from './UserEditDialog';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });

  useEffect(() => {
    fetchUsers();

    const socket = io(API_BASE_URL);

    socket.on('newUser', (user) => {
      setUsers(prev => [user, ...prev]);
    });

    socket.on('userUpdated', (updatedUser) => {
      setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
    });

    socket.on('userDeleted', (userId) => {
      setUsers(prev => prev.filter(u => u._id !== userId));
    });

    return () => socket.disconnect();
  }, []);

  const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('vcart_token');
        const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.admin.users}`, {
            headers: { 'x-auth-token': token }
        });
        setUsers(res.data);
      } catch (err) {
          console.error("Failed to fetch users", err);
      }
  };

  const handleCreateUser = async () => {
      if(!newUser.name || !newUser.email || !newUser.password) {
          Swal.fire('Error', 'Please fill all required fields', 'error');
          return;
      }
      try {
          const token = localStorage.getItem('vcart_token');
          await axios.post(`${API_BASE_URL}${API_ENDPOINTS.admin.users}`, newUser, {
              headers: { 'x-auth-token': token }
          });
          
          setOpenAddDialog(false);
          setNewUser({ name: '', email: '', password: '', role: 'user' });
          Swal.fire({
            title: 'Created!',
            text: 'User has been created successfully',
            icon: 'success',
            timer: 2000
          });
      } catch (err) {
          Swal.fire('Error', err.response?.data?.message || 'Failed to create user', 'error');
      }
  };

  const handleUpdateUser = async (userId, updates) => {
      try {
          const token = localStorage.getItem('vcart_token');
          await axios.put(`${API_BASE_URL}${API_ENDPOINTS.admin.users}/${userId}`, updates, {
              headers: { 'x-auth-token': token }
          });
          
          setEditOpen(false);
          setSelectedUser(null);
          Swal.fire({
            title: 'Updated!',
            text: 'User profile updated successfully',
            icon: 'success',
            timer: 2000
          });
      } catch (err) {
          Swal.fire('Error', 'Failed to update user', 'error');
      }
  };

  const handleDeleteUser = async (userId) => {
      const result = await Swal.fire({
          title: 'Are you sure?',
          text: "This process cannot be undone!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
          try {
              const token = localStorage.getItem('vcart_token');
              await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.admin.users}/${userId}`, {
                  headers: { 'x-auth-token': token }
              });
              Swal.fire('Deleted!', 'User has been removed.', 'success');
          } catch (err) {
              Swal.fire('Error', 'Failed to delete user', 'error');
          }
      }
  };

  const handlestatusChange = async (userId, newStatus) => {
      try {
        const token = localStorage.getItem('vcart_token');
        await axios.put(`${API_BASE_URL}${API_ENDPOINTS.admin.userStatus(userId)}`, { status: newStatus }, {
            headers: { 'x-auth-token': token }
        });
      } catch (err) {
          Swal.fire('Error', 'Failed to update status', 'error');
      }
  };

  const handleEdit = (user) => {
      setSelectedUser(user);
      setEditOpen(true);
  };

  const handleView = (user) => {
      setSelectedUser(user);
      setDetailOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                User Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Manage your system users, roles, and account permissions.
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            size="large"
            startIcon={<Add />} 
            onClick={() => setOpenAddDialog(true)}
            sx={{ borderRadius: 2, px: 3 }}
        >
            Create New User
        </Button>
      </Stack>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Quick search by name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fafafa' }}>
              <TableCell><strong>User Profile</strong></TableCell>
              <TableCell><strong>Email Address</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Account Status</strong></TableCell>
              <TableCell align="right"><strong>Administrative Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <TableRow key={user._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: user.role === 'admin' ? 'primary.main' : 'secondary.main', width: 40, height: 40 }}>
                      {user.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">Joined {new Date(user.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <Chip 
                        label={user.role?.toUpperCase()} 
                        size="small" 
                        variant="outlined"
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        sx={{ fontWeight: 'bold' }}
                    />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status || 'active'}
                    icon={user.status === 'suspended' ? <Block /> : <CheckCircle />}
                    color={user.status === 'suspended' ? 'error' : 'success'}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Details">
                            <IconButton onClick={() => handleView(user)} size="small" color="info">
                                <Visibility fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                            <IconButton onClick={() => handleEdit(user)} size="small" color="primary">
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {user.status === 'suspended' ? (
                            <Tooltip title="Activate Account">
                                <IconButton onClick={() => handlestatusChange(user._id, 'active')} size="small" color="success">
                                    <CheckCircle fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Suspend Account">
                                <IconButton onClick={() => handlestatusChange(user._id, 'suspended')} size="small" color="warning">
                                    <Block fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Delete User">
                            <IconButton onClick={() => handleDeleteUser(user._id)} size="small" color="error">
                                <Delete fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No users found matching your search.</Typography>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <UserDetailView 
        open={detailOpen} 
        onClose={() => setDetailOpen(false)} 
        user={selectedUser} 
      />

      <UserEditDialog
        open={editOpen}
        onClose={() => { setEditOpen(false); setSelectedUser(null); }}
        user={selectedUser}
        onUpdate={handleUpdateUser}
      />

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="xs">
          <DialogTitle fontWeight="bold">Create New Account</DialogTitle>
          <DialogContent>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Add a new user to the platform. They will be able to log in immediately with these credentials.
              </Typography>
              <TextField
                  autoFocus
                  margin="dense"
                  label="Full Name"
                  fullWidth
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  variant="outlined"
              />
              <TextField
                  margin="dense"
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  variant="outlined"
              />
              <TextField
                  margin="dense"
                  label="Temporary Password"
                  type="password"
                  fullWidth
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  variant="outlined"
              />
               <FormControl fullWidth margin="dense" variant="outlined">
                  <InputLabel>User Role</InputLabel>
                  <Select
                      value={newUser.role}
                      label="User Role"
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                      <MenuItem value="user">Standard User</MenuItem>
                      <MenuItem value="admin">Administrator</MenuItem>
                  </Select>
              </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setOpenAddDialog(false)} color="inherit">Cancel</Button>
              <Button onClick={handleCreateUser} variant="contained" sx={{ px: 4 }}>Create User</Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
