import React, { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, Avatar, TextField, 
  InputAdornment, IconButton, Tooltip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Search, Person, Visibility, Block, CheckCircle, Add } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import UserDetailView from './UserDetailView';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });

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
      if(!newUser.name || !newUser.email || !newUser.password) {
          alert('Please fill all fields');
          return;
      }
      try {
          const token = localStorage.getItem('vcart_token');
          await axios.post(`${API_BASE_URL}${API_ENDPOINTS.admin.createUser}`, newUser, {
              headers: { 'x-auth-token': token }
          });
          setOpenAddDialog(false);
          setNewUser({ name: '', email: '', password: '', role: 'user' });
          fetchUsers();
          alert('User created successfully');
      } catch (err) {
          alert(err.response?.data?.msg || 'Failed to create user');
      }
  };

  const handlestatusChange = async (userId, newStatus) => {
      if(!window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'suspend'} this user?`)) return;
      try {
        const token = localStorage.getItem('vcart_token');
        await axios.put(`${API_BASE_URL}${API_ENDPOINTS.admin.userStatus(userId)}`, { status: newStatus }, {
            headers: { 'x-auth-token': token }
        });
        fetchUsers();
      } catch (err) {
          alert('Failed to update status');
      }
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
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
            User Management
        </Typography>
        <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => setOpenAddDialog(true)}
        >
            Add New User
        </Button>
      </Box>

      <Card className="mb-3">
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  {/* <TableCell><strong>Orders</strong></TableCell> */}
                  {/* <TableCell><strong>Total Spent</strong></TableCell> */}
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar>
                          <Person />
                        </Avatar>
                        <Typography>{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    {/* <TableCell>{user.orders?.length || 0}</TableCell> */}
                    {/* <TableCell>${user.totalSpent || 0}</TableCell> */}
                    <TableCell>
                      <Chip
                        label={user.status || 'active'}
                        color={user.status === 'suspended' ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                        <Tooltip title="View Details">
                            <IconButton onClick={() => handleView(user)} color="primary">
                                <Visibility />
                            </IconButton>
                        </Tooltip>
                        {user.status === 'suspended' ? (
                            <Tooltip title="Activate">
                                <IconButton onClick={() => handlestatusChange(user._id, 'active')} color="success">
                                    <CheckCircle />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Suspend">
                                <IconButton onClick={() => handlestatusChange(user._id, 'suspended')} color="error">
                                    <Block />
                                </IconButton>
                            </Tooltip>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <UserDetailView 
        open={detailOpen} 
        onClose={() => setDetailOpen(false)} 
        user={selectedUser} 
      />

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
              <TextField
                  autoFocus
                  margin="dense"
                  label="Name"
                  fullWidth
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
              <TextField
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
              <TextField
                  margin="dense"
                  label="Password"
                  type="password"
                  fullWidth
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
               <FormControl fullWidth margin="dense">
                  <InputLabel>Role</InputLabel>
                  <Select
                      value={newUser.role}
                      label="Role"
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                  </Select>
              </FormControl>
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateUser} variant="contained">Create</Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
