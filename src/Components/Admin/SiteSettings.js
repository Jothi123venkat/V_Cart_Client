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
    Divider
} from '@mui/material';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { Save } from '@mui/icons-material';

const SiteSettings = () => {
    const { siteConfig, updateConfig, loading } = useSiteConfig();
    const [formData, setFormData] = useState({
        brandName: '',
        logoUrl: '',
        heroTitle: '',
        heroSubtitle: '',
        heroButtonText: '',
        heroImage: '',
        contactEmail: '',
        contactPhone: '',
        footerText: '',
        curatedCollections: {
            title: '',
            subtitle: '',
            items: []
        },
        flashSale: {
            title: '',
            subtitle: '',
            isActive: true
        },
        invoiceSettings: {
            gstin: '',
            taxRate: 18,
            termsAndConditions: '',
            startInvoiceNumber: 1,
            prefix: 'INV',
            address: '',
            bankDetails: {
                bankName: '',
                accountNo: '',
                ifscCode: '',
                branch: ''
            }
        }
    });
    const [message, setMessage] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (siteConfig) {
            setFormData({
                brandName: siteConfig.brandName || '',
                logoUrl: siteConfig.logoUrl || '',
                heroTitle: siteConfig.heroTitle || '',
                heroSubtitle: siteConfig.heroSubtitle || '',
                heroButtonText: siteConfig.heroButtonText || '',
                heroImage: siteConfig.heroImage || '',
                contactEmail: siteConfig.contactEmail || '',
                contactPhone: siteConfig.contactPhone || '',
                footerText: siteConfig.footerText || '',
                curatedCollections: {
                    title: siteConfig.curatedCollections?.title || 'The Collection',
                    subtitle: siteConfig.curatedCollections?.subtitle || 'CURATED SELECTION',
                    items: siteConfig.curatedCollections?.items?.length > 0 ? siteConfig.curatedCollections.items : [
                         { title: "Embroidery Threads", image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=2000&auto=format&fit=crop", link: "/products?category=Threads" },
                         { title: "Silk & Satin Linings", image: "https://images.unsplash.com/photo-1548142723-aae7678afa53?q=80&w=2000&auto=format&fit=crop", link: "/products?category=Linings" },
                         { title: "Tailoring Tools", image: "https://images.unsplash.com/photo-1598300056393-8dd1a56113b2?q=80&w=2000&auto=format&fit=crop", link: "/products?category=Accessories" }
                    ]
                },
                flashSale: {
                    title: siteConfig.flashSale?.title || "Don't Miss Out!",
                    subtitle: siteConfig.flashSale?.subtitle || "Limited time offers - Grab them before they're gone!",
                    isActive: siteConfig.flashSale?.isActive !== undefined ? siteConfig.flashSale.isActive : true
                },
                invoiceSettings: {
                    gstin: siteConfig.invoiceSettings?.gstin || '',
                    taxRate: siteConfig.invoiceSettings?.taxRate || 18,
                    termsAndConditions: siteConfig.invoiceSettings?.termsAndConditions || '',
                    startInvoiceNumber: siteConfig.invoiceSettings?.startInvoiceNumber || 1,
                    prefix: siteConfig.invoiceSettings?.prefix || 'INV',
                    address: siteConfig.invoiceSettings?.address || '',
                    bankDetails: {
                        bankName: siteConfig.invoiceSettings?.bankDetails?.bankName || '',
                        accountNo: siteConfig.invoiceSettings?.bankDetails?.accountNo || '',
                        ifscCode: siteConfig.invoiceSettings?.bankDetails?.ifscCode || '',
                        branch: siteConfig.invoiceSettings?.bankDetails?.branch || ''
                    }
                }
            });
        }
    }, [siteConfig]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCollectionChange = (index, field, value) => {
        const newItems = [...formData.curatedCollections.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({
            ...formData,
            curatedCollections: { ...formData.curatedCollections, items: newItems }
        });
    };

    const handleCollectionHeaderChange = (e) => {
        setFormData({
            ...formData,
            curatedCollections: { ...formData.curatedCollections, [e.target.name]: e.target.value }
        });
    };

    const handleFlashSaleChange = (e) => {
         setFormData({
            ...formData,
            flashSale: { ...formData.flashSale, [e.target.name]: e.target.value }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        
        const result = await updateConfig(formData);
        if (result.success) {
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
        }
        setSaving(false);
    };

    if (loading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                    Site Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Update the branding and content of your landing page here.
                </Typography>

                {message && (
                    <Alert severity={message.type} sx={{ mb: 3 }}>
                        {message.text}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Branding */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>Branding</Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Brand Name"
                                name="brandName"
                                value={formData.brandName}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Logo URL (optional)"
                                name="logoUrl"
                                value={formData.logoUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                                helperText="Leave empty to use Brand Name text"
                            />
                        </Grid>

                        {/* Hero Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'primary.main' }}>Hero Section</Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Hero Title"
                                name="heroTitle"
                                value={formData.heroTitle}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Hero Subtitle"
                                name="heroSubtitle"
                                value={formData.heroSubtitle}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Hero Button Text"
                                name="heroButtonText"
                                value={formData.heroButtonText}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                             <TextField
                                fullWidth
                                label="Hero Background Image URL"
                                name="heroImage"
                                value={formData.heroImage}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </Grid>

                        {/* Curated Collections Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'primary.main' }}>Curated Selection</Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                             <TextField
                                fullWidth
                                label="Section Subtitle (e.g., Curated Selection)"
                                name="subtitle"
                                value={formData.curatedCollections.subtitle}
                                onChange={handleCollectionHeaderChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                             <TextField
                                fullWidth
                                label="Section Title (e.g., The Collection)"
                                name="title"
                                value={formData.curatedCollections.title}
                                onChange={handleCollectionHeaderChange}
                            />
                        </Grid>
                        
                        {formData.curatedCollections.items.map((item, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ mt: 1, color: 'text.secondary' }}>Collection Item {index + 1}</Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Title"
                                        value={item.title}
                                        onChange={(e) => handleCollectionChange(index, 'title', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Image URL"
                                        value={item.image}
                                        onChange={(e) => handleCollectionChange(index, 'image', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Link Path"
                                        value={item.link}
                                        onChange={(e) => handleCollectionChange(index, 'link', e.target.value)}
                                    />
                                </Grid>
                            </React.Fragment>
                        ))}

                        {/* Invoice Configuration */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'primary.main' }}>Invoice Settings</Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="GSTIN"
                                name="invoiceSettings.gstin"
                                value={formData.invoiceSettings.gstin}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    invoiceSettings: { ...formData.invoiceSettings, gstin: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Default Tax Rate (%)"
                                type="number"
                                name="invoiceSettings.taxRate"
                                value={formData.invoiceSettings.taxRate}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    invoiceSettings: { ...formData.invoiceSettings, taxRate: Number(e.target.value) }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Invoice Prefix"
                                name="invoiceSettings.prefix"
                                value={formData.invoiceSettings.prefix}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    invoiceSettings: { ...formData.invoiceSettings, prefix: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Start Invoice Number"
                                type="number"
                                name="invoiceSettings.startInvoiceNumber"
                                value={formData.invoiceSettings.startInvoiceNumber}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    invoiceSettings: { ...formData.invoiceSettings, startInvoiceNumber: Number(e.target.value) }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Store Address for Invoice"
                                multiline
                                rows={3}
                                name="invoiceSettings.address"
                                value={formData.invoiceSettings.address}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    invoiceSettings: { ...formData.invoiceSettings, address: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Terms & Conditions"
                                multiline
                                rows={4}
                                name="invoiceSettings.termsAndConditions"
                                value={formData.invoiceSettings.termsAndConditions}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    invoiceSettings: { ...formData.invoiceSettings, termsAndConditions: e.target.value }
                                })}
                            />
                        </Grid>
                        
                        {/* Bank Details */}
                        <Grid item xs={12}>
                             <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, color: 'text.secondary' }}>Bank Details (Printed on Invoice)</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Bank Name"
                                value={formData.invoiceSettings.bankDetails.bankName}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    invoiceSettings: { 
                                        ...formData.invoiceSettings, 
                                        bankDetails: { ...formData.invoiceSettings.bankDetails, bankName: e.target.value } 
                                    }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Account Number"
                                value={formData.invoiceSettings.bankDetails.accountNo}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    invoiceSettings: { 
                                        ...formData.invoiceSettings, 
                                        bankDetails: { ...formData.invoiceSettings.bankDetails, accountNo: e.target.value } 
                                    }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="IFSC Code"
                                value={formData.invoiceSettings.bankDetails.ifscCode}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    invoiceSettings: { 
                                        ...formData.invoiceSettings, 
                                        bankDetails: { ...formData.invoiceSettings.bankDetails, ifscCode: e.target.value } 
                                    }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Branch"
                                value={formData.invoiceSettings.bankDetails.branch}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    invoiceSettings: { 
                                        ...formData.invoiceSettings, 
                                        bankDetails: { ...formData.invoiceSettings.bankDetails, branch: e.target.value } 
                                    }
                                })}
                            />
                        </Grid>

                        {/* Flash Sales Section */}
                        <Grid item xs={12}>
                             <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'primary.main' }}>Flash Sales Configuration</Typography>
                             <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                             <TextField
                                fullWidth
                                label="Flash Sale Title"
                                name="title"
                                value={formData.flashSale.title}
                                onChange={handleFlashSaleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                             <TextField
                                fullWidth
                                label="Flash Sale Subtitle"
                                name="subtitle"
                                value={formData.flashSale.subtitle}
                                onChange={handleFlashSaleChange}
                            />
                        </Grid>

                        {/* Contact Info */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'primary.main' }}>Footer & Contact</Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Contact Email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Contact Phone"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Footer Text"
                                name="footerText"
                                value={formData.footerText}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                startIcon={saving ? <CircularProgress size={20} color="inherit"/> : <Save />}
                                disabled={saving}
                                sx={{ mt: 2 }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default SiteSettings;
