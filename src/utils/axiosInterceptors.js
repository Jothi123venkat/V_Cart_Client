import axios from 'axios';
import toast from './toast';

/**
 * Setup Axios interceptors for automatic token expiry handling
 * This must be called after AuthContext is available
 */
export const setupAxiosInterceptors = (logout, navigate) => {
  // Response interceptor to catch authentication errors
  axios.interceptors.response.use(
    (response) => {
      // If response is successful, just return it
      return response;
    },
    (error) => {
      // Check if error is due to authentication
      if (error.response) {
        const { status } = error.response;
        
        // 401 Unauthorized - Token is invalid or expired
        // 403 Forbidden - Could also indicate token issues
        // 400 Bad Request - Also check for token validation errors
        if (status === 401 || status === 403 || (status === 400 && error.response.data?.msg?.includes('Token'))) {
          const currentPath = window.location.pathname;
          
          // Avoid showing error on login/signup pages
          if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
            // Clear user data
            logout();
            
            // Show toast notification
            toast.error('Session expired. Please login again.');
            
            // Redirect to login page
            setTimeout(() => {
              navigate('/login');
            }, 500);
          }
        }
      }
      
      // Always reject with the error so components can handle it
      return Promise.reject(error);
    }
  );

  // Request interceptor to add auth token to all requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('vcart_token');
      
      // Add token to headers if it exists
      if (token) {
        config.headers['x-auth-token'] = token;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
