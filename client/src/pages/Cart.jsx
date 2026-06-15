import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = getCartTotal();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in all required fields: Name, Phone, and Address.');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        items: cartItems.map((i) => ({
          product: i.product.id || i.product._id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        total: total,
      };

      await createOrder(orderData);

      const itemsText = cartItems
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.product.name} × ${item.quantity} = ₹${item.product.price * item.quantity}`
        )
        .join('\n');

      const message = `🛒 *New Order — K minutes*

*Customer:* ${name}
*Phone:* ${phone}
*Address:* ${address}

*Items:*
${itemsText}

*Total: ₹${total}*

Thank you for shopping with us! 🙏`;

      window.open(
        `https://wa.me/919040934485?text=${encodeURIComponent(message)}`,
        '_blank'
      );

      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Title */}
      <div style={styles.pageHeader}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
        <h1 style={styles.pageTitle}>Shopping Cart</h1>
      </div>

      {/* Empty State */}
      {cartItems.length === 0 && !orderPlaced && (
        <div style={styles.emptyState}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>Looks like you haven't added anything yet.</p>
          <Link to="/" style={styles.continueBtn}>Continue Shopping</Link>
        </div>
      )}

      {/* Order Placed Success */}
      {orderPlaced && cartItems.length === 0 && (
        <div style={styles.successState}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h2 style={{ ...styles.emptyTitle, color: '#22c55e' }}>Order placed successfully!</h2>
          <p style={styles.emptyText}>Check WhatsApp to complete your order.</p>
          <Link to="/" style={styles.continueBtn}>Back to Home</Link>
        </div>
      )}

      {/* Cart Content */}
      {cartItems.length > 0 && (
        <div style={styles.cartLayout}>
          {/* Left Column — Cart Items */}
          <div style={styles.itemsColumn}>
            {cartItems.map((item, index) => (
              <React.Fragment key={item.product.id || item.product._id}>
                <div style={styles.cartItem}>
                  {/* Product Image */}
                  <div style={styles.itemImage}>
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={styles.itemImg}
                      />
                    ) : (
                      <div style={styles.itemPlaceholder}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemName}>{item.product.name}</h3>
                    <p style={styles.itemUnitPrice}>₹{item.product.price} each</p>
                  </div>

                  {/* Quantity Controls */}
                  <div style={styles.qtyControls}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.product.id || item.product._id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    <span style={styles.qtyCount}>{item.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.product.id || item.product._id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                  </div>

                  {/* Line Total */}
                  <div style={styles.lineTotal}>
                    ₹{item.product.price * item.quantity}
                  </div>

                  {/* Remove Button */}
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFromCart(item.product.id || item.product._id)}
                    aria-label="Remove item"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
                {index < cartItems.length - 1 && <div style={styles.divider} />}
              </React.Fragment>
            ))}
          </div>

          {/* Right Column — Order Summary */}
          <div style={styles.summaryColumn}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>

              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Items ({itemCount})</span>
                <span style={styles.summaryValue}>₹{total}</span>
              </div>

              <div style={styles.summaryDivider} />

              <div style={styles.summaryRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>₹{total}</span>
              </div>

              <div style={styles.summaryDivider} />

              {/* Customer Info Form */}
              <div style={styles.formSection}>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={styles.formInput}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={styles.formInput}
                />
                <textarea
                  placeholder="Delivery Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  style={{ ...styles.formInput, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* WhatsApp Order Button */}
              <button
                style={{
                  ...styles.whatsappBtn,
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
                onClick={handleOrder}
                disabled={submitting}
              >
                {submitting ? 'Placing Order...' : 'Order via WhatsApp 📱'}
              </button>

              {/* Success Message */}
              {orderPlaced && (
                <p style={styles.successMsg}>
                  ✅ Order placed successfully! Check WhatsApp.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .cart-layout-responsive {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    paddingTop: 'calc(var(--navbar-height, 70px) + 2rem)',
    minHeight: 'calc(100vh - var(--navbar-height, 70px))',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2.5rem',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 2rem',
    textAlign: 'center',
    gap: '1rem',
  },
  successState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 2rem',
    textAlign: 'center',
    gap: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  emptyText: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  continueBtn: {
    display: 'inline-block',
    marginTop: '0.5rem',
    padding: '0.8rem 2rem',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    borderRadius: 'var(--radius-lg)',
    textDecoration: 'none',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cartLayout: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  itemsColumn: {
    flex: 2,
    minWidth: '300px',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-lg)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    flexWrap: 'wrap',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  itemImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  itemPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    minWidth: '120px',
  },
  itemName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 0.25rem 0',
  },
  itemUnitPrice: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 'var(--radius-md)',
    padding: '0.25rem',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
  },
  qtyCount: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    minWidth: '28px',
    textAlign: 'center',
  },
  lineTotal: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--accent-primary)',
    minWidth: '80px',
    textAlign: 'right',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
  },
  divider: {
    height: '1px',
    background: 'var(--glass-border)',
    margin: '0.5rem 0',
  },
  summaryColumn: {
    flex: 1,
    minWidth: '280px',
    position: 'sticky',
    top: 'calc(var(--navbar-height, 70px) + 2rem)',
  },
  summaryCard: {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-xl)',
    padding: '2rem',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  summaryTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '0 0 1.5rem 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  summaryLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  summaryValue: {
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  summaryDivider: {
    height: '1px',
    background: 'var(--glass-border)',
    margin: '0.75rem 0',
  },
  totalLabel: {
    color: 'var(--text-primary)',
    fontSize: '1.15rem',
    fontWeight: 700,
  },
  totalValue: {
    color: 'var(--accent-primary)',
    fontSize: '1.35rem',
    fontWeight: 800,
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  formInput: {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
  },
  whatsappBtn: {
    width: '100%',
    padding: '1rem',
    marginTop: '1.25rem',
    background: '#25d366',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    fontSize: '1.05rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)',
  },
  successMsg: {
    marginTop: '1rem',
    padding: '0.75rem 1rem',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: 'var(--radius-md)',
    color: '#22c55e',
    fontSize: '0.9rem',
    fontWeight: 600,
    textAlign: 'center',
  },
};

export default Cart;
