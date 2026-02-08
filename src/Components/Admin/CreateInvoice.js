import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Grid, TextField, Button, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem, Divider, Autocomplete 
} from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSiteConfig } from '../../context/SiteConfigContext';

import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const CreateInvoice = () => {
    const navigate = useNavigate();
    const { siteConfig } = useSiteConfig();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    
    // Check local storage for persistent form data if page reload happens? 
    // keeping it simple for now
    
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        mobile: '',
        email: '',
        address: '',
        state: 'Delhi', // Default
        gstin: ''
    });

    const [items, setItems] = useState([
        { productName: '', hsnCode: '', quantity: 1, rate: 0, discount: 0, taxRate: 18 }
    ]);

    const [paymentDetails, setPaymentDetails] = useState({
        mode: 'Cash',
        status: 'Paid',
        paidAmount: 0,
        transactionId: ''
    });

    const [totals, setTotals] = useState({
        subTotal: 0,
        totalTax: 0,
        grandTotal: 0
    });

    // Recalculate totals whenever items change
    useEffect(() => {
        let sub = 0;
        let tax = 0;

        items.forEach(item => {
            const q = Number(item.quantity || 0);
            const r = Number(item.rate || 0);
            const d = Number(item.discount || 0);
            const t = Number(item.taxRate || 0);

            const taxable = (r * q) - d;
            const itemTax = (taxable * t) / 100;
            
            sub += taxable;
            tax += itemTax;
        });

        const grand = Math.round(sub + tax);
        setTotals({
            subTotal: sub,
            totalTax: tax,
            grandTotal: grand
        });
        
        // Auto update paid amount if status is Paid
        if (paymentDetails.status === 'Paid') {
            setPaymentDetails(prev => ({ ...prev, paidAmount: grand }));
        }

    }, [items, paymentDetails.status, customerDetails.state]);

    // Fetch products for dropdown
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.products.getAll}`);
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            }
        };
        fetchProducts();
    }, []);

    const handleCustomerChange = (e) => {
        setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { productName: '', hsnCode: '', quantity: 1, rate: 0, discount: 0, taxRate: 18 }]);
    };

    const removeItem = (index) => {
        if (items.length === 1) return;
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = async () => {
        if (!customerDetails.name || items.some(i => !i.productName)) {
            toast.error('Please fill required fields');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}${API_ENDPOINTS.invoices.create}`, {
                customerDetails,
                items,
                paymentDetails,
                notes: 'Generated via Admin Panel'
            });
            toast.success('Invoice Created Successfully');
            navigate('/admin/invoices');
        } catch (err) {
            console.error(err);
            toast.error('Failed to create invoice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">New Invoice</Typography>
                <Button variant="outlined" onClick={() => navigate('/admin/invoices')}>Cancel</Button>
            </Box>

            <Grid container spacing={3}>
                {/* Customer Details */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Customer Details</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth size="small" label="Customer Name *" name="name" value={customerDetails.name} onChange={handleCustomerChange} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth size="small" label="Mobile *" name="mobile" value={customerDetails.mobile} onChange={handleCustomerChange} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth size="small" label="Email" name="email" value={customerDetails.email} onChange={handleCustomerChange} />
                            </Grid>
                             <Grid item xs={12} md={3}>
                                <TextField fullWidth size="small" label="GSTIN" name="gstin" value={customerDetails.gstin} onChange={handleCustomerChange} />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <TextField fullWidth size="small" label="Address" name="address" value={customerDetails.address} onChange={handleCustomerChange} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth size="small" label="State" name="state" value={customerDetails.state} onChange={handleCustomerChange} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Items */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Products</Typography>
                        
                        {items.map((item, index) => (
                            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'background.paper' }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            {(siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'description')?.label || 'Product Name')}
                                        </Typography>
                                        <Autocomplete
                                            freeSolo
                                            options={products}
                                            getOptionLabel={(option) => option.productname || ""}
                                            value={products.find(p => p.productname === item.productName) || item.productName}
                                            onChange={(event, newValue) => {
                                                if (typeof newValue === 'string') {
                                                    handleItemChange(index, 'productName', newValue);
                                                } else if (newValue && newValue.productname) {
                                                    const newItems = [...items];
                                                    newItems[index].productName = newValue.productname;
                                                    newItems[index].rate = newValue.price || 0;
                                                    if(newValue.hsnCode) newItems[index].hsnCode = newValue.hsnCode;
                                                    setItems(newItems);
                                                }
                                            }}
                                            onInputChange={(event, newInputValue) => {
                                                handleItemChange(index, 'productName', newInputValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} fullWidth size="small" placeholder="Select Product" />
                                            )}
                                        />
                                    </Grid>
                                    
                                    {(siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'hsn') === undefined || siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'hsn')?.active) && (
                                    <Grid item xs={6} md={2}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            {(siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'hsn')?.label || 'HSN')}
                                        </Typography>
                                        <TextField fullWidth size="small" value={item.hsnCode} onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)} />
                                    </Grid>
                                    )}

                                    {(siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'quantity') === undefined || siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'quantity')?.active) && (
                                    <Grid item xs={6} md={1}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            {(siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'quantity')?.label || 'Qty')}
                                        </Typography>
                                        <TextField type="number" fullWidth size="small" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value === '' ? '' : Number(e.target.value))} />
                                    </Grid>
                                    )}

                                    {(siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'rate') === undefined || siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'rate')?.active) && (
                                    <Grid item xs={6} md={1.5}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            {(siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'rate')?.label || 'Rate')}
                                        </Typography>
                                        <TextField type="number" fullWidth size="small" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value === '' ? '' : Number(e.target.value))} />
                                    </Grid>
                                    )}

                                    <Grid item xs={6} md={1}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Disc.</Typography>
                                        <TextField type="number" fullWidth size="small" value={item.discount} onChange={(e) => handleItemChange(index, 'discount', e.target.value === '' ? '' : Number(e.target.value))} />
                                    </Grid>
                                    <Grid item xs={6} md={1}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Tax%</Typography>
                                        <TextField type="number" fullWidth size="small" value={item.taxRate} onChange={(e) => handleItemChange(index, 'taxRate', e.target.value === '' ? '' : Number(e.target.value))} />
                                    </Grid>
                                    <Grid item xs={12} md={1.5} sx={{ textAlign: 'right' }}>
                                         <Typography variant="subtitle2" sx={{ display: { xs: 'inline', md: 'block' }, mr: 1 }}>
                                            {(siteConfig?.invoiceSettings?.tableColumns?.find(c => c.key === 'total')?.label || 'Total')}:
                                         </Typography>
                                         <Typography variant="body1" fontWeight="bold" sx={{ display: { xs: 'inline', md: 'block' } }}>
                                            ₹{((Number(item.rate || 0) * Number(item.quantity || 0) - Number(item.discount || 0)) * (1 + Number(item.taxRate || 0)/100)).toFixed(2)}
                                         </Typography>
                                         <IconButton size="small" color="error" onClick={() => removeItem(index)} sx={{ ml: 1 }}><Delete /></IconButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                        
                        <Button variant="outlined" startIcon={<Add />} onClick={addItem} sx={{ mt: 1 }}>Add Product</Button>
                    </Paper>

                    {/* Totals & Payment */}
                    <Paper sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Payment Details</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField select fullWidth size="small" label="Mode" value={paymentDetails.mode} onChange={(e) => setPaymentDetails({...paymentDetails, mode: e.target.value})}>
                                            <MenuItem value="Cash">Cash</MenuItem>
                                            <MenuItem value="UPI">UPI</MenuItem>
                                            <MenuItem value="Card">Card</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField select fullWidth size="small" label="Status" value={paymentDetails.status} onChange={(e) => setPaymentDetails({...paymentDetails, status: e.target.value})}>
                                            <MenuItem value="Paid">Paid</MenuItem>
                                            <MenuItem value="Unpaid">Unpaid</MenuItem>
                                            <MenuItem value="Partial">Partial</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth size="small" label="Transaction ID (Optional)" value={paymentDetails.transactionId} onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography color="text.secondary">Sub Total:</Typography>
                                        <Typography>₹{totals.subTotal.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography color="text.secondary">Total Tax:</Typography>
                                        <Typography>₹{totals.totalTax.toFixed(2)}</Typography>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6">Grand Total:</Typography>
                                        <Typography variant="h6" color="primary">₹{totals.grandTotal.toFixed(2)}</Typography>
                                    </Box>
                                </Box>
                                <Button 
                                    fullWidth 
                                     variant="contained" 
                                     size="large" 
                                     startIcon={<Save />} 
                                     sx={{ mt: 2 }}
                                     onClick={handleSubmit}
                                     disabled={loading}
                                >
                                    {loading ? 'Generating...' : 'Generate Invoice'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CreateInvoice;
