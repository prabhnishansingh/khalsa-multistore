import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { id, _id, name, description, price, category, stock, image_url } = product;
  const productId = id || _id;

  const cartItem = cart.find((item) => (item.id || item._id) === productId);
  const inCart = !!cartItem;
  const quantity = cartItem ? cartItem.quantity : 0;

  const styles = {
    card: {
      background: 'var(--bg-card, rgba(15,25,45,0.8))',
      border: '1px solid var(--border, rgba(255,255,255,0.06))',
      borderRadius: 'var(--radius-lg, 16px)',
      overflow: 'hidden',
      transition: 'var(--transition-base, all 0.3s ease)',
      cursor: 'default',
      display: 'flex',
      flexDirection: 'column',
    },
    imageArea: {
      height: '200px',
      overflow: 'hidden',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.4s ease',
    },
    placeholder: {
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, var(--bg-tertiary, #1a2744), var(--bg-secondary, #111c32))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderLetter: {
      fontSize: '4rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, rgba(245,158,11,0.4), rgba(249,115,22,0.3))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      userSelect: 'none',
    },
    badge: {
      position: 'absolute',
      top: '0.65rem',
      right: '0.65rem',
      padding: '0.2rem 0.6rem',
      borderRadius: 'var(--radius-xl, 9999px)',
      background: 'rgba(10,22,40,0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.08)',
      fontSize: '0.7rem',
      fontWeight: 600,
      color: 'var(--accent, #f59e0b)',
      letterSpacing: '0.02em',
    },
    content: {
      padding: '1.25rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    name: {
      fontWeight: 600,
      fontSize: '1.05rem',
      color: 'var(--text-primary, #f1f5f9)',
      lineHeight: 1.4,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      marginBottom: '0.35rem',
    },
    price: {
      fontSize: '1.4rem',
      fontWeight: 700,
      color: 'var(--accent, #f59e0b)',
      margin: '0.5rem 0',
    },
    stockRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      marginBottom: '0.85rem',
    },
    stockDot: (inStock) => ({
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      backgroundColor: inStock ? '#22c55e' : '#ef4444',
      boxShadow: inStock ? '0 0 6px rgba(34,197,94,0.4)' : '0 0 6px rgba(239,68,68,0.4)',
      flexShrink: 0,
    }),
    stockText: {
      fontSize: '0.78rem',
      color: 'var(--text-tertiary, #64748b)',
      fontWeight: 500,
    },
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: '100%',
      padding: '0.7rem 1rem',
      background: 'var(--accent-gradient, linear-gradient(135deg, #f59e0b, #f97316))',
      color: '#0a1628',
      fontWeight: 700,
      fontSize: '0.88rem',
      border: 'none',
      borderRadius: 'var(--radius-md, 10px)',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      marginTop: 'auto',
    },
    disabledBtn: {
      width: '100%',
      padding: '0.7rem 1rem',
      background: 'var(--glass-bg, rgba(255,255,255,0.04))',
      color: 'var(--text-tertiary, #64748b)',
      fontWeight: 600,
      fontSize: '0.88rem',
      border: '1px solid var(--border, rgba(255,255,255,0.06))',
      borderRadius: 'var(--radius-md, 10px)',
      cursor: 'not-allowed',
      marginTop: 'auto',
    },
    qtyRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: 'auto',
    },
    qtyBtn: {
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      border: '1px solid var(--border, rgba(255,255,255,0.1))',
      background: 'var(--glass-bg, rgba(255,255,255,0.04))',
      color: 'var(--text-primary, #f1f5f9)',
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      padding: 0,
    },
    qtyCount: {
      minWidth: '32px',
      textAlign: 'center',
      fontWeight: 700,
      fontSize: '1rem',
      color: 'var(--text-primary, #f1f5f9)',
    },
    removeBtn: {
      marginLeft: 'auto',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      border: '1px solid rgba(239,68,68,0.2)',
      background: 'rgba(239,68,68,0.08)',
      color: '#ef4444',
      fontSize: '0.85rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      padding: 0,
    },
  };

  const hoverCSS = `
    .product-card:hover {
      transform: translateY(-6px) !important;
      border-color: var(--accent-glow, rgba(245,158,11,0.3)) !important;
      box-shadow: var(--shadow-glow, 0 0 30px rgba(245,158,11,0.15)) !important;
    }
    .product-card:hover .product-image {
      transform: scale(1.05);
    }
    .add-cart-btn:hover {
      box-shadow: 0 4px 20px rgba(245,158,11,0.35) !important;
      transform: translateY(-1px);
    }
    .qty-btn:hover {
      background: var(--accent-gradient) !important;
      color: #0a1628 !important;
      border-color: transparent !important;
    }
    .remove-btn:hover {
      background: rgba(239,68,68,0.2) !important;
      border-color: rgba(239,68,68,0.4) !important;
    }
  `;

  return (
    <>
      <style>{hoverCSS}</style>
      <div className="product-card" style={styles.card}>
        {/* Image Area */}
        <div style={styles.imageArea}>
          {image_url && image_url !== '/placeholder.jpg' ? (
            <img
              className="product-image"
              src={image_url.startsWith('http') ? image_url : `https://khalsa-multistore-backend.onrender.com${image_url}`}
              alt={name}
              style={styles.image}
              loading="lazy"
            />
          ) : (
            <div style={styles.placeholder}>
              <span style={styles.placeholderLetter}>
                {name ? name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
          )}
          {category && (
            <span style={styles.badge}>{category}</span>
          )}
        </div>

        {/* Content */}
        <div style={styles.content}>
          <h3 style={styles.name}>{name}</h3>
          <div style={styles.price}>₹{typeof price === 'number' ? price.toFixed(2) : price}</div>

          <div style={styles.stockRow}>
            <span style={styles.stockDot(stock > 0)} />
            <span style={styles.stockText}>
              {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
            </span>
          </div>

          {/* Actions */}
          {stock === 0 ? (
            <button style={styles.disabledBtn} disabled>
              Out of Stock
            </button>
          ) : !inCart ? (
            <button
              className="add-cart-btn"
              style={styles.addBtn}
              onClick={() => addToCart(product)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart
            </button>
          ) : (
            <div style={styles.qtyRow}>
              <button
                className="qty-btn"
                style={styles.qtyBtn}
                onClick={() =>
                  quantity > 1
                    ? updateQuantity(productId, quantity - 1)
                    : removeFromCart(productId)
                }
              >
                −
              </button>
              <span style={styles.qtyCount}>{quantity}</span>
              <button
                className="qty-btn"
                style={styles.qtyBtn}
                onClick={() => updateQuantity(productId, quantity + 1)}
              >
                +
              </button>
              <button
                className="remove-btn"
                style={styles.removeBtn}
                onClick={() => removeFromCart(productId)}
                title="Remove from cart"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
