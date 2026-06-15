import React from 'react';

const CATEGORIES = [
  'All',
  'Groceries',
  'Dairy & Beverages',
  'Snacks & Sweets',
  'Personal Care',
  'Household',
  'Stationery',
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  const styles = {
    wrapper: {
      position: 'sticky',
      top: 'var(--navbar-height, 72px)',
      zIndex: 90,
      backgroundColor: 'rgba(10, 22, 40, 0.9)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      padding: '1rem 0',
      borderBottom: '1px solid var(--border)',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1.5rem',
    },
    scrollRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      paddingBottom: '2px',
    },
    pill: (isActive) => ({
      padding: '0.5rem 1.25rem',
      borderRadius: 'var(--radius-xl, 9999px)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontWeight: isActive ? 600 : 500,
      fontSize: '0.88rem',
      border: isActive ? 'none' : '1px solid var(--glass-border, rgba(255,255,255,0.08))',
      background: isActive
        ? 'var(--accent-gradient, linear-gradient(135deg, #f59e0b, #f97316))'
        : 'var(--glass-bg, rgba(255,255,255,0.04))',
      color: isActive ? '#0a1628' : 'var(--text-secondary, #94a3b8)',
      boxShadow: isActive ? 'var(--shadow-glow, 0 0 20px rgba(245,158,11,0.3))' : 'none',
      transition: 'all 0.25s ease',
      userSelect: 'none',
      flexShrink: 0,
    }),
  };

  const hoverCSS = `
    .category-pill:not(.category-active):hover {
      background: var(--bg-card-hover, rgba(255,255,255,0.08)) !important;
      color: var(--text-primary, #f1f5f9) !important;
      border-color: var(--accent-glow, rgba(245,158,11,0.3)) !important;
    }
    .category-scroll::-webkit-scrollbar {
      display: none;
    }
  `;

  return (
    <>
      <style>{hoverCSS}</style>
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div className="category-scroll" style={styles.scrollRow}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  className={`category-pill${isActive ? ' category-active' : ''}`}
                  style={styles.pill(isActive)}
                  onClick={() => onCategoryChange(cat)}
                  aria-pressed={isActive}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
