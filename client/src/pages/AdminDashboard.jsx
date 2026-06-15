import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus
} from '../api';

const AdminDashboard = () => {
  const { isAuthenticated, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Tabs
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Product Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Groceries',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Categories list (matching backend seed)
  const categories = [
    'Groceries',
    'Dairy & Beverages',
    'Snacks & Sweets',
    'Personal Care',
    'Household',
    'Stationery'
  ];

  // Auth protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'products') {
        const prodData = await getProducts('All');
        setProducts(prodData);
      } else {
        const orderData = await getOrders();
        setOrders(orderData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  // Flash messages timeout
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Open Form for Adding
  const openAddForm = () => {
    setEditProductId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Groceries',
      stock: '10',
    });
    setImageFile(null);
    setImagePreview(null);
    setIsFormOpen(true);
  };

  // Open Form for Editing
  const openEditForm = (product) => {
    setEditProductId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setImageFile(null);
    setImagePreview(product.image_url);
    setIsFormOpen(true);
  };

  // Submit Product Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.price || !formData.category) {
      setError('Please fill all required fields');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description);
    payload.append('price', formData.price);
    payload.append('category', formData.category);
    payload.append('stock', formData.stock || 0);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (editProductId) {
        await updateProduct(editProductId, payload);
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(payload);
        setSuccess('Product added successfully!');
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setSuccess('Product deleted successfully');
        fetchData();
      } catch (err) {
        setError(err.message || 'Failed to delete product');
      }
    }
  };

  // Update Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setSuccess(`Order status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  if (authLoading) {
    return (
      <div style={styles.loaderWrapper}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div style={styles.dashboardContainer} className="animate-fade-in">
      {/* Header */}
      <header style={styles.dashboardHeader}>
        <div style={styles.headerTitle}>
          <span style={styles.khanda}>⚡</span>
          <div>
            <h1 style={styles.mainTitle}>K minutes</h1>
            <p style={styles.subTitle}>Management Dashboard</p>
          </div>
        </div>
        <button onClick={logout} style={styles.logoutBtn} className="btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </header>

      {/* Tabs */}
      <div style={styles.tabBar}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'products' ? styles.activeTabBtn : {}),
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'orders' ? styles.activeTabBtn : {}),
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Orders
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div style={styles.toastSuccess} className="animate-slide-down">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {success}
        </div>
      )}
      {error && (
        <div style={styles.toastError} className="animate-slide-down">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        {activeTab === 'products' ? (
          /* Products section */
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>All Products ({products.length})</h2>
              <button onClick={openAddForm} style={styles.addBtn} className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Product
              </button>
            </div>

            {loading ? (
              <div style={styles.innerLoader}>
                <div style={styles.spinner} />
              </div>
            ) : products.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No products found. Add your first product!</p>
              </div>
            ) : (
              <div className="table-wrapper" style={{ marginTop: '1rem' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div style={styles.thumbnailWrapper}>
                            {product.image_url && product.image_url !== '/placeholder.jpg' ? (
                              <img
                                src={product.image_url.startsWith('http') ? product.image_url : `http://localhost:5000${product.image_url}`}
                                alt={product.name}
                                style={styles.thumbnail}
                              />
                            ) : (
                              <div style={styles.thumbnailPlaceholder}>
                                {product.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={styles.productName}>{product.name}</div>
                          <div style={styles.productDesc}>{product.description}</div>
                        </td>
                        <td>
                          <span style={styles.categoryBadge}>{product.category}</span>
                        </td>
                        <td style={styles.productPrice}>₹{product.price.toFixed(2)}</td>
                        <td>
                          <span
                            style={{
                              fontWeight: 600,
                              color: product.stock > 0 ? 'var(--success)' : 'var(--danger)',
                            }}
                          >
                            {product.stock} pcs
                          </span>
                        </td>
                        <td>
                          <div style={styles.actionCell}>
                            <button
                              onClick={() => openEditForm(product)}
                              style={styles.actionBtnEdit}
                              title="Edit product"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              style={styles.actionBtnDelete}
                              title="Delete product"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Orders section */
          <div>
            <h2 style={styles.sectionTitle}>Customer Orders ({orders.length})</h2>
            
            {loading ? (
              <div style={styles.innerLoader}>
                <div style={styles.spinner} />
              </div>
            ) : orders.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No orders recorded yet.</p>
              </div>
            ) : (
              <div className="table-wrapper" style={{ marginTop: '1rem' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Items Ordered</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      let parsedItems = [];
                      try {
                        parsedItems = JSON.parse(order.items_json);
                      } catch (e) {
                        parsedItems = [];
                      }

                      return (
                        <tr key={order.id}>
                          <td style={styles.orderId}>#{order.id}</td>
                          <td style={styles.orderDate}>
                            {new Date(order.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {order.customer_name}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>
                              📞 {order.customer_phone}
                            </div>
                            <div style={styles.orderAddress}>
                              📍 {order.customer_address}
                            </div>
                          </td>
                          <td>
                            <div style={styles.itemsSummary}>
                              {parsedItems.map((item, index) => (
                                <div key={index} style={styles.itemSummaryLine}>
                                  • {item.name} <span style={styles.itemQuantity}>× {item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td style={styles.orderTotal}>₹{order.total.toFixed(2)}</td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              style={{
                                ...styles.statusSelect,
                                color:
                                  order.status === 'delivered'
                                    ? 'var(--success)'
                                    : order.status === 'cancelled'
                                    ? 'var(--danger)'
                                    : order.status === 'confirmed'
                                    ? 'var(--info)'
                                    : 'var(--warning)',
                                borderColor:
                                  order.status === 'delivered'
                                    ? 'rgba(16, 185, 129, 0.3)'
                                    : order.status === 'cancelled'
                                    ? 'rgba(239, 68, 68, 0.3)'
                                    : order.status === 'confirmed'
                                    ? 'rgba(59, 130, 246, 0.3)'
                                    : 'rgba(245, 158, 11, 0.3)',
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal / Dialog for Add/Edit Product */}
      {isFormOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="animate-scale-in">
            <div style={styles.modalHeader}>
              <h3>{editProductId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsFormOpen(false)} style={styles.modalCloseBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={styles.modalForm}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Basmati Rice 5kg"
                  required
                />
              </div>

              <div style={styles.formGrid}>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 180"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGrid}>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="e.g. 50"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                  />
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div style={styles.previewContainer}>
                  <p style={styles.previewLabel}>Image Preview:</p>
                  <img
                    src={imagePreview.startsWith('blob:') || imagePreview.startsWith('data:') ? imagePreview : (imagePreview.startsWith('http') ? imagePreview : `http://localhost:5000${imagePreview}`)}
                    alt="Preview"
                    style={styles.previewImage}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Details about product size, quality, packaging..."
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  style={styles.cancelBtn}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn} className="btn btn-primary">
                  {editProductId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  dashboardContainer: {
    maxWidth: 'var(--max-width)',
    margin: '2rem auto',
    padding: '0 1.5rem',
    minHeight: '80vh',
  },
  loaderWrapper: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerLoader: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--glass-border)',
    borderTop: '3px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  dashboardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid var(--border)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  khanda: {
    fontSize: '2.5rem',
    color: 'var(--accent)',
    display: 'inline-block',
    filter: 'drop-shadow(0 0 8px rgba(255, 153, 0, 0.4))',
  },
  mainTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  subTitle: {
    fontSize: '0.85rem',
    color: 'var(--accent)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontWeight: 600,
    margin: 0,
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: 'var(--danger)',
    transition: 'all 0.3s ease',
    padding: '0.6rem 1.2rem',
    fontSize: '0.9rem',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  tabBar: {
    display: 'flex',
    gap: '0.5rem',
    margin: '2rem 0',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.5rem',
  },
  tabBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '0.75rem 1.25rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderBottom: '2px solid transparent',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  activeTabBtn: {
    color: 'var(--accent)',
    borderBottom: '2px solid var(--accent)',
  },
  mainContent: {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(var(--glass-blur))',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '2rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  thumbnailWrapper: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    background: 'var(--bg-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, var(--accent) 0%, #d97706 100%)',
    color: '#0a1628',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.2rem',
  },
  productName: {
    fontWeight: 600,
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
  },
  productDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-tertiary)',
    maxWidth: '280px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    fontWeight: 500,
  },
  productPrice: {
    fontWeight: 700,
    color: 'var(--accent)',
    fontSize: '0.95rem',
  },
  actionCell: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
  },
  actionBtnEdit: {
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    color: 'var(--info)',
    padding: '0.4rem',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  actionBtnDelete: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: 'var(--danger)',
    padding: '0.4rem',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  orderId: {
    fontWeight: 700,
    color: 'var(--accent)',
    fontFamily: 'monospace',
    fontSize: '0.95rem',
  },
  orderDate: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  orderAddress: {
    fontSize: '0.8rem',
    color: 'var(--text-tertiary)',
    marginTop: '0.25rem',
    maxWidth: '220px',
  },
  itemsSummary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  itemSummaryLine: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  itemQuantity: {
    color: 'var(--accent)',
    fontWeight: 600,
  },
  orderTotal: {
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontSize: '1rem',
  },
  statusSelect: {
    padding: '0.35rem 1.75rem 0.35rem 0.75rem',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    fontWeight: 600,
    width: 'auto',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 11, 22, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    maxWidth: '520px',
    width: '90%',
    padding: '2rem',
    boxShadow: 'var(--shadow-lg)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.75rem',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  fileInput: {
    padding: '0.65rem 0.75rem',
    fontSize: '0.85rem',
  },
  previewContainer: {
    background: 'rgba(0,0,0,0.15)',
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
  },
  previewLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-tertiary)',
    marginBottom: '0.5rem',
  },
  previewImage: {
    height: '100px',
    objectFit: 'contain',
    borderRadius: 'var(--radius-sm)',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  cancelBtn: {
    padding: '0.65rem 1.25rem',
  },
  toastSuccess: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    background: 'rgba(16, 185, 129, 0.9)',
    color: '#fff',
    padding: '0.75rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    zIndex: 2000,
  },
  toastError: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    background: 'rgba(239, 68, 68, 0.9)',
    color: '#fff',
    padding: '0.75rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    zIndex: 2000,
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1.5rem',
    color: 'var(--text-secondary)',
  },
};

export default AdminDashboard;
