// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Product endpoints
  // Product endpoints (Updated to new REST structure)
  products: {
    getAll: '/api/products',
    add: '/api/products',
    update: (id) => `/api/products/${id}`,
    delete: (id) => `/api/products/${id}`,
    getById: (id) => `/api/products/${id}`
  },
  // Cart/Order endpoints
  cart: {
    get: '/api/cart',
    add: '/api/cart/add',
    remove: (id) => `/api/cart/${id}`,
    clear: '/api/cart'
  },
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup'
  },
  user: {
    profile: '/api/profile',
    address: '/api/address',
    wishlist: '/api/wishlist'
  },
  admin: {
    users: '/api/admin/users',
    getById: (id) => `/api/admin/users/${id}`,
    userStatus: (id) => `/api/admin/users/${id}/status`
  },
  orders: {
    place: '/api/orders',
    mine: '/api/orders/myorders',
    all: '/api/orders/all',
    getUserOrders: (id) => `/api/orders/user/${id}`,
    updateStatus: (id) => `/api/orders/${id}/status`,
    cancel: (id) => `/api/orders/${id}`
  },
  notifications: {
    base: '/api/notifications',
    markRead: (id) => `/api/notifications/${id}/read`,
    markAllRead: '/api/notifications/read-all'
  },
  coupons: {
    base: '/api/coupons',
    validate: '/api/coupons/validate'
  },
  tickets: {
    base: '/api/tickets',
    mine: '/api/tickets/my',
    admin: '/api/tickets/admin',
    respond: (id) => `/api/tickets/${id}/respond`
  }
};

export default API_BASE_URL;
