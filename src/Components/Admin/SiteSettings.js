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
        footerText: ''
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
                footerText: siteConfig.footerText || ''
            });
        }
    }, [siteConfig]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
