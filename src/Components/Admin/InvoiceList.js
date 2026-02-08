import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Button, IconButton, TextField, InputAdornment, 
    Chip, MenuItem, Grid, Dialog, DialogContent, DialogActions 
} from '@mui/material';
import { Add, Search, Print, FilterList, Visibility, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import InvoiceTemplate from './InvoiceTemplate';
import { toast } from 'react-toastify';

import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [openPrintDialog, setOpenPrintDialog] = useState(false);
    
    // Ref for printing
    const componentRef = useRef();
    
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        filterInvoices();
    }, [searchTerm, statusFilter, invoices]);

    const fetchInvoices = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.invoices.base}`);
            setInvoices(res.data);
            setFilteredInvoices(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch invoices');
        }
    };

    const filterInvoices = () => {
        let temp = [...invoices];
        
        if (searchTerm) {
            temp = temp.filter(inv => 
                inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.customerDetails.mobile.includes(searchTerm)
            );
        }
        
        if (statusFilter !== 'All') {
            temp = temp.filter(inv => inv.paymentDetails.status === statusFilter);
        }
        
        setFilteredInvoices(temp);
    };

    const handleViewPrint = (invoice) => {
        setSelectedInvoice(invoice);
        setOpenPrintDialog(true);
    };

    const StatusChip = ({ status }) => {
        let color = 'default';
        if (status === 'Paid') color = 'success';
        if (status === 'Unpaid') color = 'error';
        if (status === 'Partial') color = 'warning';
        
        return <Chip label={status} color={color} size="small" />;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Invoices</Typography>
                <Box>
                    <Button 
                        variant="outlined" 
                        startIcon={<Settings />} 
                        onClick={() => navigate('/admin/invoices/configure')}
                        sx={{ mr: 2 }}
                    >
                        Configure Template
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<Add />} 
                        onClick={() => navigate('/admin/invoices/create')}
                    >
                        Create Invoice
                    </Button>
                </Box>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search Invoice No, Name, Mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Payment Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="All">All Status</MenuItem>
                            <MenuItem value="Paid">Paid</MenuItem>
                            <MenuItem value="Unpaid">Unpaid</MenuItem>
                            <MenuItem value="Partial">Partial</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={5} sx={{ textAlign: 'right' }}>
                         <Typography variant="body2" color="text.secondary">
                             Total Invoices: {filteredInvoices.length}
                         </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice No</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInvoices.map((invoice) => (
                            <TableRow key={invoice._id}>
                                <TableCell sx={{ fontWeight: 'bold' }}>{invoice.invoiceNo}</TableCell>
                                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">{invoice.customerDetails.name}</Typography>
                                    <Typography variant="caption" display="block">{invoice.customerDetails.mobile}</Typography>
                                </TableCell>
                                <TableCell style={{ fontFamily: 'monospace' }}>₹{invoice.grandTotal.toFixed(2)}</TableCell>
                                <TableCell><StatusChip status={invoice.paymentDetails.status} /></TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleViewPrint(invoice)}>
                                        <Print />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredInvoices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No invoices found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Print/View Dialog */}
            <Dialog 
                open={openPrintDialog} 
                onClose={() => setOpenPrintDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <div style={{ overflowX: 'auto' }}>
                       <InvoiceTemplate ref={componentRef} invoice={selectedInvoice} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPrintDialog(false)}>Close</Button>
                    <Button variant="contained" startIcon={<Print />} onClick={handlePrint}>
                        Print / PDF
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InvoiceList;
