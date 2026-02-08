import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Grid,
    Alert,
    CircularProgress,
    Divider,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Dialog,
    DialogContent,
    AppBar,
    Toolbar,
    Slide
} from '@mui/material';
import { Save, Add, Delete, ArrowBack, Visibility, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSiteConfig } from '../../context/SiteConfigContext';
import InvoiceTemplate from './InvoiceTemplate';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DEFAULT_TABLE_COLUMNS = [
    { key: 'sn', label: 'SN', active: true },
    { key: 'description', label: 'Description', active: true },
    { key: 'hsn', label: 'HSN', active: true },
    { key: 'quantity', label: 'Qty', active: true },
    { key: 'rate', label: 'Rate', active: true },
    { key: 'taxable', label: 'Taxable', active: true },
    { key: 'cgst', label: 'CGST', active: true },
    { key: 'sgst', label: 'SGST', active: true },
    { key: 'igst', label: 'IGST', active: true },
    { key: 'total', label: 'Total', active: true }
];

const ConfigureInvoice = () => {
    const navigate = useNavigate();
    const { siteConfig, updateConfig, loading } = useSiteConfig();
    
    const [invoiceSettings, setInvoiceSettings] = useState({
        gstin: '',
        taxRate: 18,
        termsAndConditions: '',
        startInvoiceNumber: 1,
        prefix: 'INV',
        address: '',
        storeName: '',
        bankDetails: {
            bankName: '',
            accountNo: '',
            ifscCode: '',
            branch: ''
        },
        headerTitle: 'TAX INVOICE',
        customFields: [],
        tableColumns: DEFAULT_TABLE_COLUMNS
    });

    const [message, setMessage] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (siteConfig && siteConfig.invoiceSettings) {
            setInvoiceSettings({
                ...invoiceSettings,
                ...siteConfig.invoiceSettings,
                customFields: siteConfig.invoiceSettings.customFields || [],
                tableColumns: (siteConfig.invoiceSettings.tableColumns && siteConfig.invoiceSettings.tableColumns.length > 0) 
                    ? siteConfig.invoiceSettings.tableColumns 
                    : DEFAULT_TABLE_COLUMNS
            });
        }
    }, [siteConfig]);

    const handleChange = (e) => {
        setInvoiceSettings({ ...invoiceSettings, [e.target.name]: e.target.value });
    };

    const handleBankChange = (e) => {
        setInvoiceSettings({
            ...invoiceSettings,
            bankDetails: { ...invoiceSettings.bankDetails, [e.target.name]: e.target.value }
        });
    };

    const handleAddCustomField = () => {
        setInvoiceSettings({
            ...invoiceSettings,
            customFields: [...invoiceSettings.customFields, { label: '', value: '', type: 'text', section: 'header' }]
        });
    };

    const handleRemoveCustomField = (index) => {
        const newFields = invoiceSettings.customFields.filter((_, i) => i !== index);
        setInvoiceSettings({ ...invoiceSettings, customFields: newFields });
    };

    const handleCustomFieldChange = (index, field, value) => {
        const newFields = [...invoiceSettings.customFields];
        newFields[index] = { ...newFields[index], [field]: value };
        setInvoiceSettings({ ...invoiceSettings, customFields: newFields });
    };

    const [openPreview, setShowPreview] = useState(false);

    const handleColumnChange = (index, field, value) => {
        const newColumns = [...(invoiceSettings.tableColumns || [])];
        newColumns[index] = { ...newColumns[index], [field]: value };
        setInvoiceSettings({ ...invoiceSettings, tableColumns: newColumns });
    };

    const handleAddColumn = () => {
        const newColumn = { 
            key: `custom_${Date.now()}`, 
            label: 'New Header', 
            active: true 
        };
        setInvoiceSettings({ 
            ...invoiceSettings, 
            tableColumns: [...(invoiceSettings.tableColumns || []), newColumn] 
        });
    };

    const handleRemoveColumn = (index) => {
        const newColumns = (invoiceSettings.tableColumns || []).filter((_, i) => i !== index);
        setInvoiceSettings({ ...invoiceSettings, tableColumns: newColumns });
    };


    const handleTogglePreview = () => setShowPreview(!openPreview);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        // Prepare the full config object to update, merging with existing siteConfig
        const updatedConfig = {
            ...siteConfig,
            invoiceSettings: invoiceSettings
        };
        
        const result = await updateConfig(updatedConfig);
        if (result.success) {
            setMessage({ type: 'success', text: 'Invoice settings updated successfully!' });
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
        }
        setSaving(false);
    };

    if (loading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;

    const dummyInvoice = {
        invoiceNo: 'INV-PREVIEW',
        date: new Date(),
        grandTotal: 1475.00,
        subTotal: 1250.00,
        roundOff: 0.00,
        customerDetails: {
            name: 'John Doe',
            address: '123, Sample Street, City',
            mobile: '9876543210',
            state: 'State',
            gstin: '29ABCDE1234F1Z5'
        },
        items: [
            {
                productName: 'Sample Product 1',
                hsnCode: '8517',
                quantity: 2,
                rate: 500,
                taxableValue: 1000,
                total: 1180,
                cgst: { rate: 9, amount: 90 },
                sgst: { rate: 9, amount: 90 },
                igst: { rate: 0, amount: 0 }
            },
             {
                productName: 'Sample Accessories',
                hsnCode: '8518',
                quantity: 1,
                rate: 250,
                taxableValue: 250,
                total: 295,
                cgst: { rate: 9, amount: 22.5 },
                sgst: { rate: 9, amount: 22.5 },
                igst: { rate: 0, amount: 0 }
            }
        ],
        paymentDetails: { mode: 'Cash' },
        taxSummary: { cgst: 112.5, sgst: 112.5, igst: 0 },
        termsAndConditions: invoiceSettings.termsAndConditions || 'Terms will appear here...',
        storeDetails: {
            name: invoiceSettings.storeName || 'Store Name',
            address: invoiceSettings.address || 'Store Address',
            gstin: invoiceSettings.gstin || 'GSTIN',
            phone: siteConfig?.contactPhone,
            email: siteConfig?.contactEmail
        }
    };

    return (
        <Box sx={{ maxWidth: '100%', p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => navigate('/admin/invoices')} sx={{ mr: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" fontWeight="bold">Helper & Template Configuration</Typography>
            </Box>

            {message && (
                <Alert severity={message.type} sx={{ mb: 3 }}>
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Configuration Form */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Edit Configuration</Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Visibility />}
                                onClick={handleTogglePreview}
                            >
                                Preview Template
                            </Button>
                        </Box>
                        
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Basic Settings */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="primary">General Settings</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Header Title"
                                        name="headerTitle"
                                        value={invoiceSettings.headerTitle || ''}
                                        onChange={handleChange}
                                        helperText="e.g., TAX INVOICE"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Store Name"
                                        name="storeName"
                                        value={invoiceSettings.storeName || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        multiline
                                        rows={2}
                                        label="Store Address"
                                        name="address"
                                        value={invoiceSettings.address || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="GSTIN"
                                        name="gstin"
                                        value={invoiceSettings.gstin || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Invoice Prefix"
                                        name="prefix"
                                        value={invoiceSettings.prefix || 'INV'}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        label="Start Invoice No"
                                        name="startInvoiceNumber"
                                        value={invoiceSettings.startInvoiceNumber}
                                        onChange={(e) => handleChange({ target: { name: 'startInvoiceNumber', value: Number(e.target.value) } })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        label="Tax Rate (%)"
                                        name="taxRate"
                                        value={invoiceSettings.taxRate}
                                        onChange={(e) => handleChange({ target: { name: 'taxRate', value: Number(e.target.value) } })}
                                    />
                                </Grid>

                                {/* Custom Fields */}
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
                                        <Typography variant="subtitle2" color="primary">Custom Fields</Typography>
                                        <Button startIcon={<Add />} onClick={handleAddCustomField} size="small" variant="outlined">
                                            Add
                                        </Button>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                </Grid>

                                {invoiceSettings.customFields.map((field, index) => (
                                    <React.Fragment key={index}>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Label"
                                                value={field.label}
                                                onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Value"
                                                value={field.value}
                                                onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={10} sm={3}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Section</InputLabel>
                                                <Select
                                                    value={field.section}
                                                    label="Section"
                                                    onChange={(e) => handleCustomFieldChange(index, 'section', e.target.value)}
                                                >
                                                    <MenuItem value="header">Header</MenuItem>
                                                    <MenuItem value="footer">Footer</MenuItem>
                                                    <MenuItem value="billDetails">Bill Details</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={2} sm={1}>
                                            <IconButton color="error" size="small" onClick={() => handleRemoveCustomField(index)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Grid>
                                    </React.Fragment>
                                ))}

                                {/* Bank Details */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="primary" sx={{ mt: 2 }}>Bank Details</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth size="small" label="Bank Name" name="bankName" value={invoiceSettings.bankDetails.bankName} onChange={handleBankChange} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth size="small" label="Account No" name="accountNo" value={invoiceSettings.bankDetails.accountNo} onChange={handleBankChange} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth size="small" label="IFSC Code" name="ifscCode" value={invoiceSettings.bankDetails.ifscCode} onChange={handleBankChange} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth size="small" label="Branch" name="branch" value={invoiceSettings.bankDetails.branch} onChange={handleBankChange} />
                                </Grid>

                                {/* Terms */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="primary" sx={{ mt: 2 }}>Terms & Conditions</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        name="termsAndConditions"
                                        value={invoiceSettings.termsAndConditions}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                {/* Table Configuration */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="primary" sx={{ mt: 2 }}>Table Headers</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                </Grid>
                                
                                {(invoiceSettings.tableColumns || []).map((col, index) => (
                                    <React.Fragment key={index}>
                                        <Grid item xs={8} sm={9}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Header Label"
                                                value={col.label}
                                                onChange={(e) => handleColumnChange(index, 'label', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={4} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={col.active}
                                                        onChange={(e) => handleColumnChange(index, 'active', e.target.checked)}
                                                        size="small"
                                                    />
                                                }
                                                label={col.active ? "Visible" : "Hidden"}
                                            />
                                        </Grid>
                                    </React.Fragment>
                                ))}

                                <Grid item xs={12}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        fullWidth
                                        size="large"
                                        startIcon={saving ? <CircularProgress size={20} color="inherit"/> : <Save />}
                                        disabled={saving}
                                        sx={{ mt: 2 }}
                                    >
                                        {saving ? 'Saving...' : 'Save Configuration'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>

                {/* Sticky Live Preview Panel */}
                <Dialog
                    fullScreen
                    open={openPreview}
                    onClose={handleTogglePreview}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative', bgcolor: '#333' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleTogglePreview}
                                aria-label="close"
                            >
                                <Close />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Invoice Preview
                            </Typography>
                            <Button autoFocus color="inherit" onClick={handleTogglePreview}>
                                Close
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <DialogContent sx={{ bgcolor: '#525659', display: 'flex', justifyContent: 'center', p: 4 }}>
                         <Box sx={{ 
                             minWidth: '210mm', 
                             width: 'fit-content', 
                             bgcolor: 'white', 
                             boxShadow: 5,
                             height: 'fit-content'
                         }}>
                            <InvoiceTemplate 
                                key={JSON.stringify(invoiceSettings.tableColumns)}
                                invoice={dummyInvoice} 
                                siteConfig={{ ...siteConfig, invoiceSettings }} 
                            />
                         </Box>
                    </DialogContent>
                </Dialog>
            </Grid>
        </Box>
    );
};

export default ConfigureInvoice;
