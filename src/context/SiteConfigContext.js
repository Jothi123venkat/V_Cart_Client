import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const SiteConfigContext = createContext();

export const useSiteConfig = () => useContext(SiteConfigContext);

export const SiteConfigProvider = ({ children }) => {
    const [siteConfig, setSiteConfig] = useState({
        brandName: 'V-CART',
        logoUrl: '',
        heroTitle: 'Elevate Your Style with V-Cart',
        heroSubtitle: 'Discover the latest trends in fashion and accessories.',
        heroButtonText: 'Shop Now',
        heroImage: '',
        contactEmail: 'support@vcart.com',
        contactPhone: '+1 234 567 890',
        footerText: '© 2026 V-Cart. All rights reserved.'
    });
    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/config`);
            if (res.data) {
                setSiteConfig(res.data);
            }
        } catch (err) {
            console.error("Error fetching site config:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const updateConfig = async (newConfig) => {
        try {
            const token = localStorage.getItem('vcart_token');
            const res = await axios.put(`${API_BASE_URL}/api/config`, newConfig, {
                headers: { 'x-auth-token': token }
            });
            setSiteConfig(res.data);
            return { success: true };
        } catch (err) {
            console.error("Error updating site config:", err);
            return { success: false, error: err.response?.data?.msg || "Update failed" };
        }
    };

    return (
        <SiteConfigContext.Provider value={{ siteConfig, loading, updateConfig, refreshConfig: fetchConfig }}>
            {children}
        </SiteConfigContext.Provider>
    );
};
