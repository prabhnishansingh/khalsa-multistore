import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const styles = {
    backdrop: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 999,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    drawer: {
      position: 'fixed',
      right: 0,
      top: 0,
      height: '100vh',
      width: '400px',
      maxWidth: '90vw',
      backgroundColor: 'var(--bg-secondary, #111c32)',
      zIndex: 1000,
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: isOpen ? '-8px 0 40px rgba(0,0,0,0.5)' : 'none',
    },
    header: {
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))',
      flexShrink: 0,
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
    },
    headerTitle: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: 'var(--text-primary, #f1f5f9)',
    },
    headerBadge: {
      padding: '0.15rem 0.55rem',
      borderRadius: 'var(--radius-xl, 9999px)',
      background: 'var(--accent-gradient, linear-gradient(135deg, #f59e0b, #f97316))',
      color: '#0a1628',
      fontSize: '0.72rem',
      fontWeight: 700,
    },
    closeBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: '1px solid var(--border, rgba(255,255,255,0.1))',
      background: 'var(--glass-bg, rgba(255,255,255,0.04))',
      color: 'var(--text-secondary, #94a3b8)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      padding: 0,
    },
    body: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem 1.5rem',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '1rem',
      color: 'var(--text-tertiary, #64748b)',
    },
    emptyIcon: {
      opacity: 0.4,
    },
    emptyText: {
      fontSize: '1.05rem',
      fontWeight: 500,
      color: 'var(--text-secondary, #94a3b8)',
    },
    shopLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.6rem 1.5rem',
      background: 'var(--accent-gradient, linear-gradient(135deg, #f59e0b, #f97316))',
      color: '#0a1628',
      fontWeight: 700,
      fontSize: '0.88rem',
      border: 'none',
      borderRadius: 'var(--radius-md, 10px)',
      textDecoration: 'none',
      transition: 'all 0.25s ease',
    },
    cartItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.85rem',
      padding: '1rem 0',
    },
    itemImage: {
      width: '60px',
      height: '60px',
      borderRadius: 'var(--radius-md, 10px)',
      overflow: 'hidden',
      flexShrink: 0,
      border: '1px solid var(--border, rgba(255,255,255,0.06))',
    },
    itemImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    itemPlaceholder: {
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, var(--bg-tertiary, #1a2744), var(--bg-secondary, #111c32))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      fontWeight: 700,
      color: 'var(--accent, #f59e0b)',
      opacity: 0.5,
    },
    itemInfo: {
      flex: 1,
      minWidth: 0,
    },
    itemName: {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: 'var(--text-primary, #f1f5f9)',
      marginBottom: '0.2rem',
      lineHeight: 1.3,
    },
    itemPrice: {
      fontSize: '0.82rem',
      color: 'var(--accent, #f59e0b)',
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
    itemControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
    },
    smallBtn: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      border: '1px solid var(--border, rgba(255,255,255,0.1))',
      background: 'var(--glass-bg, rgba(255,255,255,0.04))',
      color: 'var(--text-primary, #f1f5f9)',
      fontSize: '0.9rem',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      padding: 0,
    },
    itemQty: {
      minWidth: '24px',
      textAlign: 'center',
      fontSize: '0.88rem',
      fontWeight: 700,
      color: 'var(--text-primary, #f1f5f9)',
    },
    itemTotal: {
      textAlign: 'right',
      flexShrink: 0,
    },
    itemTotalPrice: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: 'var(--text-primary, #f1f5f9)',
    },
    removeItemBtn: {
      marginTop: '0.3rem',
      background: 'none',
      border: 'none',
      color: 'var(--text-tertiary, #64748b)',
      fontSize: '0.72rem',
      cursor: 'pointer',
      padding: '0.15rem 0',
      transition: 'color 0.2s ease',
      textAlign: 'right',
      display: 'block',
      width: '100%',
    },
    divider: {
      height: '1px',
      background: 'var(--border, rgba(255,255,255,0.06))',
      margin: 0,
      border: 'none',
    },
    footer: {
      padding: '1.25rem 1.5rem',
      borderTop: '1px solid var(--border, rgba(255,255,255,0.06))',
      flexShrink: 0,
    },
    totalRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
    },
    totalLabel: {
      fontSize: '0.95rem',
      fontWeight: 500,
      color: 'var(--text-secondary, #94a3b8)',
    },
    totalAmount: {
      fontSize: '1.35rem',
      fontWeight: 700,
      color: 'var(--accent, #f59e0b)',
    },
    viewCartBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: '100%',
      padding: '0.8rem 1rem',
      background: 'var(--accent-gradient, linear-gradient(135deg, #f59e0b, #f97316))',
      color: '#0a1628',
      fontWeight: 700,
      fontSize: '0.95rem',
      border: 'none',
      borderRadius: 'var(--radius-md, 10px)',
      textDecoration: 'none',
      transition: 'all 0.25s ease',
      cursor: 'pointer',
    },
  };

  const hoverCSS = `
    .drawer-close:hover {
      background: rgba(255,255,255,0.1) !important;
      color: var(--text-primary) !important;
    }
    .drawer-small-btn:hover {
      background: var(--accent-gradient) !important;
      color: #0a1628 !important;
      border-color: transparent !important;
    }
    .drawer-remove:hover {
      color: #ef4444 !important;
    }
    .drawer-view-cart:hover {
      box-shadow: 0 4px 20px rgba(245,158,11,0.35) !important;
      transform: translateY(-1px);
    }
  `;

  return (
    <>
      <style>{hoverCSS}</style>

      {/* Backdrop */}
      <div style={styles.backdrop} onClick={onClose} />

      {/* Drawer Panel */}
      <div style={styles.drawer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.headerTitle}>Your Cart</span>
            {totalItems > 0 && (
              <span style={styles.headerBadge}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            className="drawer-close"
            style={styles.closeBtn}
            onClick={onClose}
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {cart.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <span style={styles.emptyText}>Your cart is empty</span>
              <Link to="/" style={styles.shopLink} onClick={onClose}>
                Start Shopping
              </Link>
            </div>
          ) : (
            cart.map((item, index) => (
              <React.Fragment key={item._id}>
                <div style={styles.cartItem}>
                  {/* Image */}
                  <div style={styles.itemImage}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={styles.itemImg}
                      />
                    ) : (
                      <div style={styles.itemPlaceholder}>
                        {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemPrice}>
                      ₹{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </div>
                    <div style={styles.itemControls}>
                      <button
                        className="drawer-small-btn"
                        style={styles.smallBtn}
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item._id, item.quantity - 1)
                            : removeFromCart(item._id)
                        }
                      >
                        −
                      </button>
                      <span style={styles.itemQty}>{item.quantity}</span>
                      <button
                        className="drawer-small-btn"
                        style={styles.smallBtn}
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div style={styles.itemTotal}>
                    <div style={styles.itemTotalPrice}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="drawer-remove"
                      style={styles.removeItemBtn}
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {index < cart.length - 1 && <hr style={styles.divider} />}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</span>
            </div>
            <Link
              to="/cart"
              className="drawer-view-cart"
              style={styles.viewCartBtn}
              onClick={onClose}
            >
              View Cart →
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
