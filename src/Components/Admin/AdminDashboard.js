import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  Inventory,
  People,
  AttachMoney,
  MoreVert,
  ArrowUpward,
  ConfirmationNumber,
  Launch,
  Refresh,
  Store,
  SupportAgent
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    orders: [],
    users: [],
    products: [],
    tickets: []
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('vcart_token');
      const headers = { 'x-auth-token': token };

      const [ordersRes, usersRes, productsRes, ticketsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}${API_ENDPOINTS.orders.all}`, { headers }),
        axios.get(`${API_BASE_URL}${API_ENDPOINTS.admin.users}`, { headers }),
        axios.get(`${API_BASE_URL}${API_ENDPOINTS.products.all}`), // All products might be public
        axios.get(`${API_BASE_URL}${API_ENDPOINTS.tickets.admin}`, { headers })
      ]);

      setData({
        orders: ordersRes.data,
        users: usersRes.data,
        products: productsRes.data,
        tickets: ticketsRes.data
      });
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived Stats
  const stats = useMemo(() => {
    const totalRevenue = data.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingTickets = data.tickets.filter(t => t.status === 'Open').length;
    const processingOrders = data.orders.filter(o => o.status === 'Processing').length;
    
    return { totalRevenue, pendingTickets, processingOrders };
  }, [data]);

  // Chart Data preparation
  const salesChartData = useMemo(() => {
    // Group orders by date (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = data.orders.filter(o => o.date?.startsWith(date));
      return {
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        orders: dayOrders.length
      };
    });
  }, [data.orders]);

  const categoryData = useMemo(() => {
    const counts = {};
    data.products.forEach(p => {
      const cat = p.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 5);
  }, [data.products]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <AttachMoney />, color: '#2e7d32', trend: '+12.5%' },
    { title: 'Total Orders', value: data.orders.length, icon: <ShoppingCart />, color: '#1976d2', trend: `${stats.processingOrders} pending` },
    { title: 'Active Users', value: data.users.length, icon: <People />, color: '#9c27b0', trend: 'In directory' },
    { title: 'Support Tickets', value: data.tickets.length, icon: <SupportAgent />, color: '#ed6c02', trend: `${stats.pendingTickets} urgent` },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight="bold" color="#1a202c">
                Commerce Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Welcome back, Admin. Here's what's happening with your store today.
            </Typography>
        </Box>
        <Button variant="contained" startIcon={<Refresh />} onClick={fetchData}>Sync Data</Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={0} sx={{ 
                border: '1px solid #e2e8f0', 
                borderRadius: 4,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}10`, color: stat.color, borderRadius: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Chip 
                    label={stat.trend} 
                    size="small" 
                    sx={{ bgcolor: `${stat.color}05`, color: stat.color, fontWeight: 'bold', fontSize: '0.7rem' }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight="medium" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Revenue Analysis</Typography>
                <Stack direction="row" spacing={1}>
                    <Chip label="7 Days" size="small" color="primary" />
                    <Chip label="30 Days" size="small" variant="outlined" />
                </Stack>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#718096', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#718096', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Pie */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Inventory Split</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {categoryData.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[idx % COLORS.length] }} />
                        <Typography variant="caption" fontWeight="medium">{item.name}</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">{item.value} items</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Tables Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Recent Orders</Typography>
                        <Button size="small" endIcon={<ArrowUpward sx={{ transform: 'rotate(45deg)' }} />} onClick={() => navigate('/admin/orders')}>View All</Button>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.orders.slice(0, 5).map((order) => (
                                    <TableRow key={order._id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">{order.user?.name || 'Guest'}</Typography>
                                            <Typography variant="caption" color="text.secondary">{new Date(order.date).toLocaleDateString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={order.status} size="small" sx={{ fontSize: '0.7rem' }} color={order.status === 'Processing' ? 'warning' : 'success'} />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>₹{order.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Grid>

        <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Active Tickets</Typography>
                        <Button size="small" onClick={() => navigate('/admin/support')}>Manage</Button>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.tickets.filter(t => t.status !== 'Resolved').slice(0, 5).map((ticket) => (
                                    <TableRow key={ticket._id} hover>
                                        <TableCell>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{ticket.subject}</Typography>
                                            <Typography variant="caption" color="text.secondary">{ticket.user?.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ color: ticket.priority === 'High' ? 'error.main' : 'warning.main', fontWeight: 'bold' }}>
                                                {ticket.priority}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption">{new Date(ticket.date).toLocaleDateString()}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {data.tickets.filter(t => t.status !== 'Resolved').length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                            <Typography variant="caption" color="success.main">No pending tickets!</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

