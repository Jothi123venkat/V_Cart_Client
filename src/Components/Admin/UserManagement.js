import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Stack,
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
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add,
  Search,
  AdminPanelSettings,
  Person,
  Block,
  CheckCircle,
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import Swal from 'sweetalert2';
import UserDetailView from './UserDetailView';
import UserEditDialog from './UserEditDialog';

const UserManagement = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog States
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [editOpen, setEditOpen] = useState(false);
  
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
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
      if (!newUser.name || !newUser.email || !newUser.password) {
          Swal.fire('Error', 'Please fill all required fields', 'error');
          return;
      }

      try {
          const token = localStorage.getItem('vcart_token');
          await axios.post(`${API_BASE_URL}${API_ENDPOINTS.auth.signup}`, newUser, { // Assuming admin creates via signup or specific admin create endpoint
               headers: { 'x-auth-token': token }
          });
          Swal.fire('Success', 'User created successfully', 'success');
          setOpenAddDialog(false);
          setNewUser({ name: '', email: '', password: '', role: 'user' });
          fetchUsers();
      } catch(err) {
          Swal.fire('Error', err.response?.data?.msg || 'Failed to create user', 'error');
      }
  };

  const handlestatusChange = async (userId, newStatus) => {
      try {
          const token = localStorage.getItem('vcart_token');
          await axios.put(`${API_BASE_URL}${API_ENDPOINTS.admin.userStatus(userId)}`, 
            { status: newStatus },
            { headers: { 'x-auth-token': token } }
          );
          Swal.fire('Success', `User ${newStatus === 'active' ? 'activated' : 'suspended'}`, 'success');
          fetchUsers();
      } catch(err) {
           Swal.fire('Error', 'Failed to update user status', 'error');
      }
  };

  const handleDeleteUser = async (userId) => {
      const result = await Swal.fire({
          title: 'Delete User?',
          text: 'This action cannot be undone.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
          try {
              const token = localStorage.getItem('vcart_token');
              // Assuming generic delete or specific admin delete
              await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.admin.users}/${userId}`, {
                  headers: { 'x-auth-token': token }
              });
              Swal.fire('Deleted', 'User removed', 'success');
              fetchUsers();
          } catch(err) {
              Swal.fire('Error', 'Failed to delete user', 'error');
          }
      }
  };

  const handleUpdateUser = async (updatedData) => {
      // Logic handled in UserEditDialog, or called here if passed up
      // If UserEditDialog handles the API call itself, we just refresh
      fetchUsers();
      setEditOpen(false);
  };

  const handleView = (user) => {
      setSelectedUser(user);
      setDetailOpen(true);
  };

  const handleEdit = (user) => {
      setSelectedUser(user);
      setEditOpen(true);
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const lowerQuery = searchQuery.toLowerCase();
    return users.filter(user => 
        user.name.toLowerCase().includes(lowerQuery) || 
        user.email.toLowerCase().includes(lowerQuery)
    );
  }, [users, searchQuery]);

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color={theme.palette.text.primary}>
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

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: theme.shadows[1], bgcolor: theme.palette.background.paper }}>
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

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[1], bgcolor: theme.palette.background.paper }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
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
                        <Typography variant="subtitle2" fontWeight="bold" color={theme.palette.text.primary}>{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">Joined {new Date(user.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>{user.email}</TableCell>
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

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { bgcolor: theme.palette.background.paper } }}>
          <DialogTitle fontWeight="bold" color={theme.palette.text.primary}>Create New Account</DialogTitle>
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
