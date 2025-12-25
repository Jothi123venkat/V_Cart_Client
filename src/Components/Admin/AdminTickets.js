import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  Tab,
  Tabs
} from '@mui/material';
import {
  Search,
  FilterList,
  Reply,
  Visibility,
  CheckCircle,
  PendingActions,
  ErrorOutline,
  Person,
  Email,
  CalendarToday,
  PriorityHigh,
  ConfirmationNumber,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import UserDetailView from './UserDetailView';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openRespondDialog, setOpenRespondDialog] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    high: 0
  });

  // Customer Detail State
  const [viewCustomerOpen, setViewCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('vcart_token');
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.tickets.admin}`, {
        headers: { 'x-auth-token': token }
      });
      setTickets(res.data);
      
      // Calculate Stats
      const total = res.data.length;
      const open = res.data.filter(t => t.status === 'Open').length;
      const resolved = res.data.filter(t => t.status === 'Resolved').length;
      const high = res.data.filter(t => t.priority === 'High' && t.status !== 'Resolved').length;
      
      setStats({ total, open, resolved, high });
    } catch (err) {
      console.error("Fetch tickets error", err);
      Swal.fire('Error', 'Failed to load support tickets', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRespond = (ticket) => {
    setSelectedTicket(ticket);
    setAdminResponse(ticket.adminResponse || '');
    setOpenRespondDialog(true);
  };

  const handleViewCustomer = async (userId) => {
    try {
        const token = localStorage.getItem('vcart_token');
        const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.admin.getById(userId)}`, {
            headers: { 'x-auth-token': token }
        });
        setSelectedCustomer(res.data);
        setViewCustomerOpen(true);
    } catch (err) {
        console.error("Fetch customer error", err);
        Swal.fire('Error', 'Failed to fetch customer details', 'error');
    }
  };

  const submitResponse = async () => {
    if (!adminResponse.trim()) {
      Swal.fire('Error', 'Please enter a response message', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('vcart_token');
      await axios.put(`${API_BASE_URL}${API_ENDPOINTS.tickets.respond(selectedTicket._id)}`, {
        adminResponse: adminResponse,
        status: 'Resolved'
      }, {
        headers: { 'x-auth-token': token }
      });

      Swal.fire({
        title: 'Success!',
        text: 'Response sent and ticket marked as resolved.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      setOpenRespondDialog(false);
      fetchTickets();
    } catch (err) {
      console.error("Update ticket error", err);
      Swal.fire('Error', 'Failed to update ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tabValue === 0) return matchesSearch; // All
    if (tabValue === 1) return matchesSearch && ticket.status === 'Open';
    if (tabValue === 2) return matchesSearch && ticket.status === 'In Progress';
    if (tabValue === 3) return matchesSearch && ticket.status === 'Resolved';
    return matchesSearch;
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'Open': return <Chip size="small" label="Open" color="error" icon={<ErrorOutline fontSize="small" />} />;
      case 'In Progress': return <Chip size="small" label="In Progress" color="warning" icon={<PendingActions fontSize="small" />} />;
      case 'Resolved': return <Chip size="small" label="Resolved" color="success" icon={<CheckCircle fontSize="small" />} />;
      default: return <Chip size="small" label={status} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
                Customer Support Tickets
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Manage and respond to user queries and issues.
            </Typography>
        </Box>
        <Button 
            variant="outlined" 
            startIcon={<Refresh />} 
            onClick={fetchTickets}
            disabled={loading}
        >
            Refresh
        </Button>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Tickets', count: stats.total, icon: <ConfirmationNumber />, color: '#1976d2' },
          { label: 'Pending Action', count: stats.open, icon: <ErrorOutline />, color: '#d32f2f' },
          { label: 'High Priority', count: stats.high, icon: <PriorityHigh />, color: '#f57c00' },
          { label: 'Resolved', count: stats.resolved, icon: <CheckCircle />, color: '#388e3c' },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ 
                height: '100%', 
                borderLeft: `6px solid ${item.color}`,
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    {item.label}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {item.count}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color }}>
                  {item.icon}
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters and Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            textColor="primary" 
            indicatorColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label={`All (${stats.total})`} />
          <Tab label={`Open (${stats.open})`} />
          <Tab label="In Progress" />
          <Tab label="Resolved" />
        </Tabs>
        
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search by User, Subject, or ID..."
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
            sx={{ maxWidth: 400 }}
          />
          <IconButton color="primary">
            <FilterList />
          </IconButton>
        </Box>
      </Paper>

      {/* Tickets Table */}
      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Ticket Info</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={30} />
                  <Typography variant="body2" sx={{ mt: 1 }}>Loading tickets...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary">No tickets found matches your criteria.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">#{ticket._id.substring(ticket._id.length - 8).toUpperCase()}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(ticket.date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.8rem', bgcolor: 'primary.light' }}>
                            {ticket.user?.name?.charAt(0) || <Person fontSize="small" />}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="medium" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }} onClick={() => handleViewCustomer(ticket.user?._id)}>
                                {ticket.user?.name || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">{ticket.user?.email}</Typography>
                        </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ticket.subject}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{ticket.category}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: getPriorityColor(ticket.priority) }} />
                        <Typography variant="body2">{ticket.priority}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{getStatusChip(ticket.status)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View/Respond">
                      <IconButton color="primary" onClick={() => handleRespond(ticket)}>
                        {ticket.status === 'Resolved' ? <Visibility /> : <Reply />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Response Dialog */}
      <Dialog open={openRespondDialog} onClose={() => setOpenRespondDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Ticket Details
          {selectedTicket && getStatusChip(selectedTicket.status)}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedTicket && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Customer Info</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">{selectedTicket.user?.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{selectedTicket.user?.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2">{new Date(selectedTicket.date).toLocaleString()}</Typography>
                  </Box>
                  <Button size="small" variant="outlined" onClick={() => handleViewCustomer(selectedTicket.user?._id)}>View Profile</Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Issue Subject</Typography>
                <Typography variant="body1" sx={{ p: 1, bgcolor: '#f9f9f9', borderRadius: 1, mb: 2 }}>
                  {selectedTicket.subject}
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Customer's Message</Typography>
                <Box sx={{ p: 2, bgcolor: '#f0f4f8', borderRadius: 2, mb: 3 }}>
                    <Typography variant="body2">{selectedTicket.message}</Typography>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {selectedTicket.status === 'Resolved' ? 'Response History' : 'Your Response'}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Type your response to the customer here..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  disabled={selectedTicket.status === 'Resolved'}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenRespondDialog(false)}>Close</Button>
          {selectedTicket && selectedTicket.status !== 'Resolved' && (
            <Button 
                variant="contained" 
                onClick={submitResponse} 
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
            >
                Mark as Resolved
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Customer Detail View */}
      <UserDetailView 
        open={viewCustomerOpen}
        onClose={() => setViewCustomerOpen(false)}
        user={selectedCustomer}
      />
    </Box>
  );
};

export default AdminTickets;
