import axios, { AxiosError } from 'axios';

// Environment variables with type safety
interface EnvVariables {
  VITE_API_URL: string;
}

interface ErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

// Validate environment variables
const validateEnv = () => {
  const requiredVars: (keyof EnvVariables)[] = ['VITE_API_URL'];
  const missingVars = requiredVars.filter(
    (key) => !import.meta.env[key]
  );

  if (missingVars.length > 0) {
    console.error(
      'Missing required environment variables:',
      missingVars.join(', ')
    );
    throw new Error('Missing required environment variables');
  }
};

// Initialize environment variables
validateEnv();

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for all requests
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server might be down');
      throw new Error('Request timeout - the server is taking too long to respond. Please try again.');
    } else if (!error.response) {
      console.error('Network error - please check your connection');
      throw new Error('Network error - please check your internet connection and try again');
    } else if (error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired - please login again');
    } else if (error.response.status === 403) {
      throw new Error('Access denied - you do not have permission to perform this action');
    } else if (error.response.status === 404) {
      throw new Error('Resource not found - please check your request');
    } else if (error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      throw new Error(`Rate limit exceeded. Please try again ${retryAfter ? `after ${retryAfter} seconds` : 'later'}`);
    } else if (error.response.status === 503) {
      const errorData = error.response.data as ErrorResponse;
      const errorMessage = errorData?.message || errorData?.error;
      if (errorMessage?.includes('model is overloaded')) {
        throw new Error('AI service is currently busy. Please try again in a few minutes.');
      }
      throw new Error('AI services are currently unavailable. Please try again later.');
    } else if (error.response.status >= 500) {
      const errorData = error.response.data as ErrorResponse;
      const errorMessage = errorData?.message || errorData?.error;
      if (errorMessage?.includes('Gemini AI')) {
        throw new Error('AI service is experiencing issues. Please try again later.');
      }
      throw new Error('Server error - please try again later');
    } else {
      const errorData = error.response.data as ErrorResponse;
      const errorMessage = errorData?.message || error.message;
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }
  }
);

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      throw new Error('No response from server');
    }
  }
  throw new Error('Error setting up request');
};

export const auth = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'farmer' | 'buyer' | 'admin';
    location: string;
    phone: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for uploads
      });
      
      if (!response.data?.url) {
        throw new Error('No image URL received from server');
      }
      
      return response.data.url;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Image upload error:', error.message);
        if (error.message.includes('Network Error')) {
          throw new Error('Unable to connect to the server. Please check if the server is running.');
        }
        throw new Error(`Failed to upload image: ${error.message}`);
      }
      throw new Error('Failed to upload image');
    }
  },

  verifyToken: () => {
    return api.get('/auth/verify');
  },
};

export const farmer = {
  // Expenses
  addExpense: async (expenseData: {
    category: string;
    amount: number;
    date: string;
    description: string;
  }) => {
    const response = await api.post('/farmer/expenses', expenseData);
    return response.data;
  },

  getExpenses: async () => {
    const response = await api.get('/farmer/expenses');
    return response.data;
  },

  updateExpense: async (expenseId: string, expenseData: {
    category: string;
    amount: number;
    date: string;
    description: string;
  }) => {
    const response = await api.put(`/farmer/expenses/${expenseId}`, expenseData);
    return response.data;
  },

  deleteExpense: async (expenseId: string) => {
    const response = await api.delete(`/farmer/expenses/${expenseId}`);
    return response.data;
  },

  // Trade Management
  createTrade: async (data: {
    product: string;
    quantity: number;
    amount: number;
  }) => {
    return api.post('/farmer/trades', data);
  },

  getTrades: () => {
    return api.get('/farmer/trades');
  },

  updateTradeStatus: async (tradeId: string, status: string) => {
    console.log('Updating trade status:', { tradeId, status });
    const response = await api.put(`/farmer/trades/${encodeURIComponent(tradeId)}/status`, { 
      status: status.toLowerCase() 
    });
    return response;
  },

  createTestTrades: (data: { count: number }) => {
    return api.post('/farmer/trades/test', data);
  },

  // Analytics
  getSalesAnalytics: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    const response = await api.get(`/farmer/analytics/sales?period=${period}`);
    return response.data;
  },

  getInventoryAnalytics: async () => {
    const response = await api.get('/farmer/analytics/inventory');
    return response.data;
  },

  getAIPredictions: async () => {
    const response = await api.get('/farmer/analytics/predictions');
    return response.data;
  },

  getExpenseAnalytics: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    const response = await api.get(`/farmer/analytics/expenses?period=${period}`);
    return response.data;
  },

  // AI Analytics
  getAIAnalytics: async (data: {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    metrics: string[];
    filters?: {
      category?: string;
      dateRange?: { start: string; end: string };
      minPrice?: number;
      maxPrice?: number;
      organic?: boolean;
    };
  }) => {
    try {
      const response = await api.post('/farmer/ai-analytics', data, {
        timeout: 60000, // 60 second timeout for AI analytics
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('AI Analytics Error:', error.message);
        throw new Error(`Failed to get AI analytics: ${error.message}`);
      }
      throw new Error('Failed to get AI analytics');
    }
  },

  getProductRecommendations: async () => {
    const response = await api.get('/farmer/ai-recommendations');
    return response.data;
  },

  getMarketInsights: async () => {
    const response = await api.get('/farmer/market-insights');
    return response.data;
  },

  // Products
  addProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: string;
    location: string;
    harvestDate: string;
    organic: boolean;
    images?: Array<{
      url: string;
      public_id: string;
    }>;
  }) => {
    // Format the image data to match backend expectations
    const formattedData = {
      ...productData,
      images: [{
        url: productData.image,
        public_id: productData.image.split('/').pop()?.split('.')[0] || ''
      }]
    };
    delete formattedData.image; // Remove the old image field
    
    console.log('Sending product data:', formattedData);
    const response = await api.post('/products', formattedData);
    return response.data;
  },

  updateProduct: async (id: string, productData: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
    image?: string;
    location?: string;
    harvestDate?: string;
    organic?: boolean;
    images?: Array<{
      url: string;
      public_id: string;
    }>;
  }) => {
    try {
      const formattedData = { ...productData };
      
      // Format image data if present
      if (formattedData.image) {
        formattedData.images = [{
          url: formattedData.image,
          public_id: formattedData.image.split('/').pop()?.split('.')[0] || ''
        }];
        delete formattedData.image;
      }

      console.log('Sending update data:', formattedData);
      
      const response = await api.put(`/products/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  deleteProduct: async (productId: string) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProduct: async (productId: string) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for uploads
      });
      
      if (!response.data?.url) {
        throw new Error('No image URL received from server');
      }
      
      return response.data.url;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Image upload error:', error.message);
        if (error.message.includes('Network Error')) {
          throw new Error('Unable to connect to the server. Please check if the server is running.');
        }
        throw new Error(`Failed to upload image: ${error.message}`);
      }
      throw new Error('Failed to upload image');
    }
  },
};

export const customer = {
  getProducts: async (filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    organic?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  getProduct: async (productId: string) => {
    const response = await api.get(`/customer/products/${productId}`);
    return response.data;
  },

  getCart: async () => {
    try {
      const response = await api.get('/customer/cart');
      console.log('Cart response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Get cart error:', error); // Debug log
      handleApiError(error);
    }
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      console.log('Adding to cart:', { productId, quantity }); // Debug log
      const response = await api.post('/customer/cart/add', { productId, quantity });
      console.log('Add to cart response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Add to cart error:', error); // Debug log
      handleApiError(error);
    }
  },

  updateCartItem: async (productId: string, quantity: number) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      console.log('Updating cart item:', { productId, quantity }); // Debug log
      const response = await api.put(`/customer/cart/update/${productId}`, { quantity });
      console.log('Update cart response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Update cart error:', error); // Debug log
      handleApiError(error);
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      console.log('Removing from cart:', productId); // Debug log
      const response = await api.delete(`/customer/cart/remove/${productId}`);
      console.log('Remove from cart response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Remove from cart error:', error); // Debug log
      handleApiError(error);
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete('/customer/cart/clear');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  placeOrder: async (orderData: {
    items: { productId: string; quantity: number }[];
    shippingAddress: string;
    paymentMethod: string;
  }) => {
    const response = await api.post('/customer/orders', orderData);
    return response.data;
  },

  getOrders: async () => {
    try {
      const response = await api.get('/customer/orders');
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getMarketInsights: async () => {
    try {
      const response = await api.get('/customer/market-insights');
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  checkout: async () => {
    try {
      const response = await api.post('/customer/cart/checkout');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getChatResponse: async (message: string) => {
    try {
      const response = await api.post('/customer/chat', { message });
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getTrades: async () => {
    try {
      const response = await api.get('/customer/trades');
      console.log('Trades response:', response.data); // Debug log
      if (!response.data?.trades) {
        throw new Error('Invalid response format from server');
      }
      return response.data.trades;
    } catch (error) {
      console.error('Error fetching trades:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch trades: ${error.message}`);
      }
      throw new Error('Failed to fetch trades');
    }
  },
};

export default api; 