import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  DialogActions,
  Chip,
  Stack
} from '@mui/material';
import {
  Refresh,
  ConfirmationNumber,
  ErrorOutline,
  PriorityHigh,
  CheckCircle,
  Search,
  FilterList,
  Person,
  Visibility,
  Reply,
  Email,
  CalendarToday,
  Cancel
} from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import UserDetailView from './UserDetailView';
import Swal from 'sweetalert2';

const AdminTickets = () => {
  const theme = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Response Dialog State
  const [openRespondDialog, setOpenRespondDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Customer View State
  const [viewCustomerOpen, setViewCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('vcart_token');
      // Using the endpoints defined in api.js
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.tickets.admin}`, {
        headers: { 'x-auth-token': token }
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
      // Fallback for demo if API fails or is not implemented yet
        // setTickets([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'Open').length,
      high: tickets.filter(t => t.priority === 'High').length,
      resolved: tickets.filter(t => t.status === 'Resolved').length
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Filter by Tab
    if (tabValue === 1) filtered = filtered.filter(t => t.status === 'Open');
    if (tabValue === 2) filtered = filtered.filter(t => t.status === 'In Progress');
    if (tabValue === 3) filtered = filtered.filter(t => t.status === 'Resolved');

    // Filter by Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t._id.toLowerCase().includes(lowerSearch) ||
        t.subject.toLowerCase().includes(lowerSearch) ||
        t.user?.name?.toLowerCase().includes(lowerSearch) ||
        t.user?.email?.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [tickets, tabValue, searchTerm]);

  const getStatusChip = (status) => {
    let color = 'default';
    let icon = null;
    switch (status) {
      case 'Open': color = 'error'; icon = <ErrorOutline fontSize="small" />; break;
      case 'In Progress': color = 'warning'; icon = <Refresh fontSize="small" />; break;
      case 'Resolved': color = 'success'; icon = <CheckCircle fontSize="small" />; break;
      default: break;
    }
    return <Chip label={status} color={color} size="small" icon={icon} sx={{ fontWeight: 'bold' }} />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const handleRespond = (ticket) => {
    setSelectedTicket(ticket);
    setAdminResponse(''); // Reset response
    setOpenRespondDialog(true);
  };

  const submitResponse = async () => {
    if (!adminResponse.trim()) {
        Swal.fire('Error', 'Please enter a response', 'error');
        return;
    }
    
    setSubmitting(true);
    try {
        const token = localStorage.getItem('vcart_token');
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.tickets.respond(selectedTicket._id)}`, 
            { response: adminResponse },
            { headers: { 'x-auth-token': token } }
        );
        
        Swal.fire('Success', 'Response sent and ticket resolved', 'success');
        setOpenRespondDialog(false);
        fetchTickets(); // Refresh list
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to send response', 'error');
    } finally {
        setSubmitting(false);
    }
  };

  const handleViewCustomer = async (userId) => {
      if (!userId) return;
      
      // Try to find user in ticket first if fully populated
      const ticketUser = tickets.find(t => t.user?._id === userId)?.user;
      
      if (ticketUser && ticketUser.email) {
          setSelectedCustomer(ticketUser);
          setViewCustomerOpen(true);
      } else {
        // Fetch full user details if needed, for now just show what we have or placeholder
         try {
             const token = localStorage.getItem('vcart_token');
             const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.admin.getById(userId)}`, {
                 headers: { 'x-auth-token': token }
             });
             setSelectedCustomer(res.data);
             setViewCustomerOpen(true);
         } catch(err) {
             console.error("Could not fetch user details", err);
             Swal.fire('Error', 'Could not fetch customer details', 'error');
         }
      }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>
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
                boxShadow: theme.shadows[1],
                bgcolor: theme.palette.background.paper
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    {item.label}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>
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
      <Paper sx={{ mb: 4, borderRadius: 2, bgcolor: theme.palette.background.paper, boxShadow: theme.shadows[1] }}>
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
      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2, borderColor: theme.palette.divider, bgcolor: theme.palette.background.paper }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: theme.palette.action.hover }}>
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
                    <Typography variant="subtitle2" fontWeight="bold" color={theme.palette.text.primary}>#{ticket._id.substring(ticket._id.length - 8).toUpperCase()}</Typography>
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
                    <Typography variant="body2" color={theme.palette.text.primary} sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ticket.subject}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{ticket.category}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: getPriorityColor(ticket.priority) }} />
                        <Typography variant="body2" color={theme.palette.text.primary}>{ticket.priority}</Typography>
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
      <Dialog open={openRespondDialog} onClose={() => setOpenRespondDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.palette.text.primary }}>
          Ticket Details
          {selectedTicket && getStatusChip(selectedTicket.status)}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedTicket && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color={theme.palette.text.primary}>Customer Info</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" color={theme.palette.text.primary}>{selectedTicket.user?.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2" color={theme.palette.text.primary} sx={{ wordBreak: 'break-all' }}>{selectedTicket.user?.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color={theme.palette.text.primary}>{new Date(selectedTicket.date).toLocaleString()}</Typography>
                  </Box>
                  <Button size="small" variant="outlined" onClick={() => handleViewCustomer(selectedTicket.user?._id)}>View Profile</Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color={theme.palette.text.primary}>Issue Subject</Typography>
                <Typography variant="body1" sx={{ p: 1, bgcolor: theme.palette.action.hover, borderRadius: 1, mb: 2, color: theme.palette.text.primary }}>
                  {selectedTicket.subject}
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color={theme.palette.text.primary}>Customer's Message</Typography>
                <Box sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: 2, mb: 3 }}>
                    <Typography variant="body2" color={theme.palette.text.primary}>{selectedTicket.message}</Typography>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color={theme.palette.text.primary}>
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
