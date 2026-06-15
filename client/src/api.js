const API_BASE = 'https://khalsa-multistore-backend.onrender.com/api';

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Only set Content-Type for non-FormData bodies
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

// Products
export const getProducts = (category) => {
  const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  return apiFetch(`/products${query}`);
};

export const getProduct = (id) => apiFetch(`/products/${id}`);

export const createProduct = (formData) => apiFetch('/products', {
  method: 'POST',
  body: formData, // FormData for file upload
});

export const updateProduct = (id, formData) => apiFetch(`/products/${id}`, {
  method: 'PUT',
  body: formData,
});

export const deleteProduct = (id) => apiFetch(`/products/${id}`, {
  method: 'DELETE',
});

// Auth
export const login = (username, password) => apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ username, password }),
});

export const verifyToken = () => apiFetch('/auth/verify');

// Orders
export const createOrder = (orderData) => apiFetch('/orders', {
  method: 'POST',
  body: JSON.stringify(orderData),
});

export const getOrders = () => apiFetch('/orders');

export const updateOrderStatus = (id, status) => apiFetch(`/orders/${id}/status`, {
  method: 'PUT',
  body: JSON.stringify({ status }),
});

export default apiFetch;
