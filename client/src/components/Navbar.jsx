import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  const closeMobile = () => setMobileOpen(false);

  const styles = {
    nav: {
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      height: '72px',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      backgroundColor: scrolled ? 'rgba(10,22,40,0.95)' : 'rgba(10,22,40,0.85)',
      borderBottom: '1px solid var(--border)',
      boxShadow: scrolled
        ? '0 4px 30px rgba(0,0,0,0.3)'
        : '0 2px 15px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
    },
    container: {
      width: '100%',
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      textDecoration: 'none',
    },
    brandSymbol: {
      fontSize: '1.8rem',
      lineHeight: 1,
      color: 'var(--accent)',
      filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.4))',
    },
    brandName: {
      fontSize: '1.35rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #f59e0b, #f97316, #fbbf24)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-0.02em',
    },
    desktopLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.5rem 1rem',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem',
      fontWeight: 500,
      transition: 'all 0.25s ease',
      position: 'relative',
    },
    cartBadge: {
      position: 'absolute',
      top: '2px',
      right: '2px',
      minWidth: '18px',
      height: '18px',
      borderRadius: '9px',
      background: 'var(--accent-gradient)',
      color: '#0a1628',
      fontSize: '0.65rem',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 4px',
      animation: cartCount > 0 ? 'pulse 2s ease-in-out infinite' : 'none',
      boxShadow: '0 0 8px rgba(245,158,11,0.5)',
    },
    hamburger: {
      display: 'none',
      flexDirection: 'column',
      gap: '5px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      zIndex: 110,
    },
    hamburgerLine: (index) => ({
      width: '24px',
      height: '2px',
      backgroundColor: 'var(--text-primary)',
      borderRadius: '2px',
      transition: 'all 0.3s ease',
      transform: mobileOpen
        ? index === 0
          ? 'rotate(45deg) translate(5px, 5px)'
          : index === 1
          ? 'opacity(0)'
          : 'rotate(-45deg) translate(5px, -5px)'
        : 'none',
      opacity: mobileOpen && index === 1 ? 0 : 1,
    }),
    mobileMenu: {
      position: 'absolute',
      top: '72px',
      left: 0,
      right: 0,
      backgroundColor: 'rgba(10,22,40,0.97)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      padding: '1rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      transform: mobileOpen ? 'translateY(0)' : 'translateY(-120%)',
      opacity: mobileOpen ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    },
    mobileLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1rem',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
      color: 'var(--text-secondary)',
      fontSize: '1rem',
      fontWeight: 500,
      transition: 'all 0.2s ease',
    },
  };

  // Inject responsive CSS for hamburger
  const responsiveCSS = `
    @media (max-width: 768px) {
      .navbar-desktop-links { display: none !important; }
      .navbar-hamburger { display: flex !important; }
    }
    .nav-link-hover:hover {
      background: var(--glass-bg) !important;
      color: var(--accent) !important;
    }
    .mobile-link-hover:hover {
      background: var(--glass-bg) !important;
      color: var(--accent) !important;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
    @keyframes badgePop {
      0% { transform: scale(0); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  `;

  return (
    <>
      <style>{responsiveCSS}</style>
      <nav style={styles.nav}>
        <div style={styles.container}>
          {/* Brand */}
          <Link to="/" style={styles.brand}>
            <span style={styles.brandSymbol}>⚡</span>
            <span style={styles.brandName}>K minutes</span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-desktop-links" style={styles.desktopLinks}>
            <NavLink
              to="/"
              className="nav-link-hover"
              style={({ isActive }) => ({
                ...styles.navLink,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </NavLink>

            <NavLink
              to="/cart"
              className="nav-link-hover"
              style={({ isActive }) => ({
                ...styles.navLink,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              })}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Cart
              {cartCount > 0 && (
                <span style={styles.cartBadge}>{cartCount}</span>
              )}
            </NavLink>

            <NavLink
              to="/admin"
              className="nav-link-hover"
              style={({ isActive }) => ({
                ...styles.navLink,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Admin
            </NavLink>
          </div>

          {/* Hamburger */}
          <button
            className="navbar-hamburger"
            style={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span style={styles.hamburgerLine(0)} />
            <span style={styles.hamburgerLine(1)} />
            <span style={styles.hamburgerLine(2)} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div style={styles.mobileMenu}>
          <NavLink
            to="/"
            className="mobile-link-hover"
            style={({ isActive }) => ({
              ...styles.mobileLink,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            })}
            onClick={closeMobile}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </NavLink>

          <NavLink
            to="/cart"
            className="mobile-link-hover"
            style={({ isActive }) => ({
              ...styles.mobileLink,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            })}
            onClick={closeMobile}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Cart {cartCount > 0 && `(${cartCount})`}
          </NavLink>

          <NavLink
            to="/admin"
            className="mobile-link-hover"
            style={({ isActive }) => ({
              ...styles.mobileLink,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            })}
            onClick={closeMobile}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Admin
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
