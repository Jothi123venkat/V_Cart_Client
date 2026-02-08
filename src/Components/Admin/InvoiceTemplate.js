import React, { forwardRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Divider } from '@mui/material';
import { useSiteConfig } from '../../context/SiteConfigContext';

// Using forwardRef to allow react-to-print to access the DOM node
const InvoiceTemplate = forwardRef(({ invoice, siteConfig: propConfig }, ref) => {
    const { siteConfig: contextConfig } = useSiteConfig();
    const siteConfig = propConfig || contextConfig;

    if (!invoice) return null;

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Helper to convert number to words (Simplified for demo)
    const numberToWords = (num) => {
        // This is a placeholder. e.g., "46,415" -> "Forty Six Thousand Four Hundred Fifteen"
        // In production, use 'number-to-words' package
        return `${num} (Amount in words)`; 
    };

    const isInterState = invoice.taxSummary.igst > 0;

    const DEFAULT_COLUMNS = [
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

    const columns = siteConfig?.invoiceSettings?.tableColumns || DEFAULT_COLUMNS;
    const visibleColumns = columns.filter(c => c.active);

    return (
        <Box 
            ref={ref} 
            sx={{ 
                p: 4, 
                bgcolor: 'white', 
                color: 'black',
                maxWidth: '210mm', // A4 width
                minHeight: '297mm', // A4 height
                mx: 'auto',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    {siteConfig?.logoUrl && <img src={siteConfig.logoUrl} alt="Logo" style={{ height: 60, marginBottom: 10 }} />}
                    <Typography variant="h5" fontWeight="bold" color="primary.main">{siteConfig?.invoiceSettings?.storeName || invoice.storeDetails?.name || 'V-CART'}</Typography>
                    <Typography>{siteConfig?.invoiceSettings?.address || invoice.storeDetails?.address}</Typography>
                    <Typography>GSTIN: {siteConfig?.invoiceSettings?.gstin || invoice.storeDetails?.gstin}</Typography>
                    <Typography>Contact: {siteConfig?.contactPhone || invoice.storeDetails?.phone}, {siteConfig?.contactEmail || invoice.storeDetails?.email}</Typography>
                    
                    {/* Header Custom Fields */}
                    {siteConfig?.invoiceSettings?.customFields?.filter(f => f.section === 'header').map((field, index) => (
                        <Typography key={index}>{field.label}: {field.value}</Typography>
                    ))}
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold">{siteConfig?.invoiceSettings?.headerTitle || 'TAX INVOICE'}</Typography>
                    <Typography sx={{ color: 'red', fontWeight: 'bold' }}>ORIGINAL FOR RECIPIENT</Typography>
                </Box>
            </Box>

            {/* Bill Details */}
            <Grid container sx={{ border: '1px solid black', mb: 2 }}>
                <Grid item xs={6} sx={{ borderRight: '1px solid black', p: 1 }}>
                    <Typography fontWeight="bold" sx={{ borderBottom: '1px solid #eee', mb: 1 }}>Billed To:</Typography>
                    <Typography fontWeight="bold">{invoice.customerDetails.name}</Typography>
                    <Typography>{invoice.customerDetails.address}</Typography>
                    <Typography>Mobile: {invoice.customerDetails.mobile}</Typography>
                    {invoice.customerDetails.gstin && <Typography>GSTIN: {invoice.customerDetails.gstin}</Typography>}
                    <Typography>State: {invoice.customerDetails.state}</Typography>
                </Grid>
                <Grid item xs={6} sx={{ p: 1 }}>
                     <Grid container>
                        <Grid item xs={6}><Typography fontWeight="bold">Invoice No:</Typography></Grid>
                        <Grid item xs={6}><Typography>{invoice.invoiceNo}</Typography></Grid>
                        
                        <Grid item xs={6}><Typography fontWeight="bold">Date:</Typography></Grid>
                        <Grid item xs={6}><Typography>{new Date(invoice.date).toLocaleDateString()}</Typography></Grid>
                        
                        <Grid item xs={6}><Typography fontWeight="bold">Payment Mode:</Typography></Grid>
                        <Grid item xs={6}><Typography>{invoice.paymentDetails.mode}</Typography></Grid>

                        {/* Bill Details Custom Fields */}
                        {siteConfig?.invoiceSettings?.customFields?.filter(f => f.section === 'billDetails').map((field, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={6}><Typography fontWeight="bold">{field.label}:</Typography></Grid>
                                <Grid item xs={6}><Typography>{field.value}</Typography></Grid>
                            </React.Fragment>
                        ))}
                     </Grid>
                </Grid>
            </Grid>

            {/* Items Table */}
            <TableContainer sx={{ border: '1px solid black', mb: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f0f0f0' }}>
                            {visibleColumns.map((col) => {
                                if (col.key === 'igst' && !isInterState) return null;
                                if ((col.key === 'cgst' || col.key === 'sgst') && isInterState) return null;

                                if (['cgst', 'sgst', 'igst'].includes(col.key)) {
                                    return (
                                        <TableCell key={col.key} colSpan={2} sx={{ borderRight: '1px solid black', fontWeight: 'bold', textAlign: 'center', color: 'black' }}>
                                            {col.label}
                                        </TableCell>
                                    );
                                }
                                return (
                                    <TableCell key={col.key} rowSpan={2} sx={{ borderRight: '1px solid black', fontWeight: 'bold', textAlign: 'center', color: 'black' }}>
                                        {col.label}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                        <TableRow sx={{ bgcolor: '#f0f0f0' }}>
                            {visibleColumns.map((col) => {
                                if (col.key === 'igst' && !isInterState) return null;
                                if ((col.key === 'cgst' || col.key === 'sgst') && isInterState) return null;

                                if (['cgst', 'sgst', 'igst'].includes(col.key)) {
                                    return (
                                        <React.Fragment key={col.key}>
                                            <TableCell sx={{ borderRight: '1px solid black', fontWeight: 'bold', textAlign: 'center', color: 'black' }}>%</TableCell>
                                            <TableCell sx={{ borderRight: '1px solid black', fontWeight: 'bold', textAlign: 'center', color: 'black' }}>Amt</TableCell>
                                        </React.Fragment>
                                    );
                                }
                                return null;
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoice.items.map((item, index) => (
                            <TableRow key={index} sx={{ height: 30 }}>
                                {visibleColumns.map((col) => {
                                    if (col.key === 'igst' && !isInterState) return null;
                                    if ((col.key === 'cgst' || col.key === 'sgst') && isInterState) return null;

                                    switch (col.key) {
                                        case 'sn': return <TableCell key={col.key} sx={{ borderRight: '1px solid black', textAlign: 'center' }}>{index + 1}</TableCell>;
                                        case 'description': return <TableCell key={col.key} sx={{ borderRight: '1px solid black' }}>{item.productName}</TableCell>;
                                        case 'hsn': return <TableCell key={col.key} sx={{ borderRight: '1px solid black', textAlign: 'center' }}>{item.hsnCode || '8517'}</TableCell>;
                                        case 'quantity': return <TableCell key={col.key} sx={{ borderRight: '1px solid black', textAlign: 'center' }}>{item.quantity}</TableCell>;
                                        case 'rate': return <TableCell key={col.key} sx={{ borderRight: '1px solid black', textAlign: 'right' }}>{item.rate.toFixed(2)}</TableCell>;
                                        case 'taxable': return <TableCell key={col.key} sx={{ borderRight: '1px solid black', textAlign: 'right' }}>{item.taxableValue.toFixed(2)}</TableCell>;
                                        case 'cgst': return (
                                            <React.Fragment key={col.key}>
                                                <TableCell sx={{ borderRight: '1px solid black', textAlign: 'right' }}>{item.cgst?.rate}%</TableCell>
                                                <TableCell sx={{ borderRight: '1px solid black', textAlign: 'right' }}>{item.cgst?.amount?.toFixed(2)}</TableCell>
                                            </React.Fragment>
                                        );
                                        case 'sgst': return (
                                            <React.Fragment key={col.key}>
                                                <TableCell sx={{ borderRight: '1px solid black', textAlign: 'right' }}>{item.sgst?.rate}%</TableCell>
                                                <TableCell sx={{ borderRight: '1px solid black', textAlign: 'right' }}>{item.sgst?.amount?.toFixed(2)}</TableCell>
                                            </React.Fragment>
                                        );
                                        case 'igst': return (
                                            <React.Fragment key={col.key}>
                                                <TableCell sx={{ borderRight: '1px solid black', textAlign: 'right' }}>{item.igst?.rate}%</TableCell>
                                                <TableCell sx={{ borderRight: '1px solid black', textAlign: 'right' }}>{item.igst?.amount?.toFixed(2)}</TableCell>
                                            </React.Fragment>
                                        );
                                        case 'total': return <TableCell key={col.key} sx={{ textAlign: 'right' }}>{item.total.toFixed(2)}</TableCell>;
                                        default: return <TableCell key={col.key} sx={{ borderRight: '1px solid black' }}>{item[col.key] || ''}</TableCell>;
                                    }
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Totals Section */}
            <Grid container sx={{ border: '1px solid black', mb: 2 }}>
                <Grid item xs={7} sx={{ borderRight: '1px solid black', p: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography fontWeight="bold" sx={{ textDecoration: 'underline' }}>Invoice Total in Words:</Typography>
                        <Typography fontStyle="italic" sx={{ mt: 1 }}>{numberToWords(invoice.grandTotal)}</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography fontWeight="bold" sx={{ textDecoration: 'underline' }}>Bank Details:</Typography>
                        <Grid container>
                             <Grid item xs={4}>Bank Name:</Grid>
                             <Grid item xs={8}>{siteConfig?.invoiceSettings?.bankDetails?.bankName}</Grid>
                             <Grid item xs={4}>A/c No:</Grid>
                             <Grid item xs={8}>{siteConfig?.invoiceSettings?.bankDetails?.accountNo}</Grid>
                             <Grid item xs={4}>IFSC:</Grid>
                             <Grid item xs={8}>{siteConfig?.invoiceSettings?.bankDetails?.ifscCode}</Grid>
                             <Grid item xs={4}>Branch:</Grid>
                             <Grid item xs={8}>{siteConfig?.invoiceSettings?.bankDetails?.branch}</Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={5}>
                    <Grid container>
                        <Grid item xs={6} sx={{ p:0.5, borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>Taxable Amount</Grid>
                        <Grid item xs={6} sx={{ p:0.5, borderBottom: '1px solid #eee', textAlign: 'right' }}>{invoice.subTotal.toFixed(2)}</Grid>
                        
                        {!isInterState ? (
                            <>
                            <Grid item xs={6} sx={{ p:0.5, borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>CGST Total</Grid>
                            <Grid item xs={6} sx={{ p:0.5, borderBottom: '1px solid #eee', textAlign: 'right' }}>{invoice.taxSummary.cgst.toFixed(2)}</Grid>

                            <Grid item xs={6} sx={{ p:0.5, borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>SGST Total</Grid>
                            <Grid item xs={6} sx={{ p:0.5, borderBottom: '1px solid #eee', textAlign: 'right' }}>{invoice.taxSummary.sgst.toFixed(2)}</Grid>
                            </>
                        ) : (
                            <>
                            <Grid item xs={6} sx={{ p:0.5, borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>IGST Total</Grid>
                            <Grid item xs={6} sx={{ p:0.5, borderBottom: '1px solid #eee', textAlign: 'right' }}>{invoice.taxSummary.igst.toFixed(2)}</Grid>
                            </>
                        )}

                        <Grid item xs={6} sx={{ p:0.5, borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>Round Off</Grid>
                        <Grid item xs={6} sx={{ p:0.5, borderBottom: '1px solid #eee', textAlign: 'right' }}>{invoice.roundOff.toFixed(2)}</Grid>

                        <Grid item xs={6} sx={{ p:0.5, borderRight: '1px solid #eee', bgcolor: '#e0e0e0', fontWeight: 'bold' }}>Grand Total</Grid>
                        <Grid item xs={6} sx={{ p:0.5, bgcolor: '#e0e0e0', fontWeight: 'bold', textAlign: 'right' }}>{formatCurrency(invoice.grandTotal)}</Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Footer */}
            <Box sx={{ border: '1px solid black', p: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: '60%' }}>
                    <Typography fontWeight="bold" sx={{ textDecoration: 'underline' }}>Terms & Conditions:</Typography>
                    <Typography variant="caption" sx={{ whiteSpace: 'pre-line' }}>{siteConfig?.invoiceSettings?.termsAndConditions || invoice.termsAndConditions}</Typography>
                    
                    {/* Footer Custom Fields */}
                    {siteConfig?.invoiceSettings?.customFields?.filter(f => f.section === 'footer').map((field, index) => (
                        <Typography key={index} variant="caption" display="block" sx={{ mt: 1 }}>{field.label}: {field.value}</Typography>
                    ))}
                </Box>
                <Box sx={{ width: '35%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
                    <Typography fontWeight="bold">For {siteConfig?.invoiceSettings?.storeName || invoice.storeDetails?.name || 'V-CART'}</Typography>
                    <Box sx={{ height: 40 }} />
                    <Typography variant="caption">Authorized Signatory</Typography>
                </Box>
            </Box>
        </Box>
    );
});

export default InvoiceTemplate;
