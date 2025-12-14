// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Product endpoints
  products: {
    getAll: '/',
    add: '/Addproduct',
    update: (id) => `/updateuser/${id}`,
    delete: (id) => `/deleteproduct/${id}`,
    getById: (id) => `/getuser/${id}`
  },
  // Cart/Order endpoints
  cart: {
    getOrders: '/cart/getcart',
    placeOrder: '/cart/addcart',
    cancelOrder: (id) => `/cart/deletecart/${id}`
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
    createUser: '/api/admin/users/create',
    userStatus: (id) => `/api/admin/users/${id}/status`
  },
  orders: {
    place: '/api/orders',
    mine: '/api/orders/myorders',
    all: '/api/orders/all',
    updateStatus: (id) => `/api/orders/${id}/status`,
    cancel: (id) => `/api/orders/${id}`
  }
};

export default API_BASE_URL;
