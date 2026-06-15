import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import { useCart } from '../context/CartContext';
import { getProducts } from '../api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(activeCategory);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <HeroBanner />

      {/* Products Section */}
      <section id="products" style={styles.productsSection}>
        <div style={styles.container}>
          {/* Section Header */}
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Our Products</h2>
              <p style={styles.productCount}>
                {loading ? 'Loading...' : `${filteredProducts.length} products available`}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div style={styles.searchWrapper}>
            <div style={styles.searchIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Category Filter */}
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Product Grid */}
          <div style={styles.productGrid}>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-card" style={styles.skeletonCard}>
                  <div style={styles.skeletonImage} />
                  <div style={styles.skeletonBody}>
                    <div style={styles.skeletonLine} />
                    <div style={{ ...styles.skeletonLine, width: '60%' }} />
                    <div style={{ ...styles.skeletonLine, width: '40%' }} />
                  </div>
                </div>
              ))
            ) : filteredProducts.length === 0 ? (
              <div style={styles.emptyState}>
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M8 11h6" />
                </svg>
                <h3 style={styles.emptyTitle}>No products found</h3>
                <p style={styles.emptyText}>
                  Try adjusting your search or browse a different category.
                </p>
              </div>
            ) : (
              filteredProducts.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Floating Cart Button (mobile) */}
      <button
        className="floating-cart-btn"
        style={styles.floatingCart}
        onClick={() => setIsCartOpen(true)}
        aria-label="Open cart"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
        {cartCount > 0 && (
          <span style={styles.floatingBadge}>{cartCount}</span>
        )}
      </button>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Inline styles for animations and mobile-only floating button */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .skeleton-card {
          animation: shimmer 1.5s infinite linear;
          background: linear-gradient(
            90deg,
            var(--bg-card) 25%,
            rgba(255,255,255,0.06) 37%,
            var(--bg-card) 63%
          );
          background-size: 800px 100%;
        }

        .floating-cart-btn {
          display: flex !important;
        }

        @media (min-width: 769px) {
          .floating-cart-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  productsSection: {
    padding: '4rem 0',
    animation: 'fadeInUp 0.8s ease-out',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  sectionHeader: {
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    margin: 0,
    letterSpacing: '-0.02em',
    background: 'var(--accent-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  productCount: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    margin: '0.25rem 0 0 0',
  },
  searchWrapper: {
    position: 'relative',
    maxWidth: '480px',
    marginBottom: '1.5rem',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 3rem',
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-lg)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    boxSizing: 'border-box',
  },
  productGrid: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    marginTop: '2rem',
    position: 'relative',
    minHeight: '200px',
  },
  skeletonCard: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    height: '300px',
    border: '1px solid var(--glass-border)',
  },
  skeletonImage: {
    height: '180px',
    background: 'rgba(255,255,255,0.03)',
  },
  skeletonBody: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  skeletonLine: {
    height: '14px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.05)',
    width: '100%',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    maxWidth: '400px',
  },
  floatingCart: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    border: 'none',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(255, 153, 0, 0.35)',
    zIndex: 999,
    transition: 'transform 0.3s ease',
  },
  floatingBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: '#ef4444',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--bg-primary)',
  },
};

export default Home;
