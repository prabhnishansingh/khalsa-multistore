import React from 'react';

const HeroBanner = () => {
  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const styles = {
    hero: {
      position: 'relative',
      width: '100%',
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: `
        radial-gradient(circle at 20% 50%, rgba(245,158,11,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(249,115,22,0.08) 0%, transparent 50%),
        radial-gradient(circle at 50% 80%, rgba(251,191,36,0.06) 0%, transparent 50%),
        radial-gradient(circle at 70% 60%, rgba(245,158,11,0.05) 0%, transparent 40%),
        linear-gradient(180deg, var(--bg-primary) 0%, rgba(15,25,45,1) 100%)
      `,
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 60%)',
      pointerEvents: 'none',
      zIndex: 1,
    },
    content: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      padding: '2rem 1.5rem',
      maxWidth: '800px',
    },
    eyebrow: {
      fontSize: '0.85rem',
      fontWeight: 600,
      color: 'var(--accent)',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      marginBottom: '1.25rem',
      animation: 'heroFadeIn 0.8s ease-out both',
    },
    heading: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 700,
      lineHeight: 1.15,
      marginBottom: '1.25rem',
      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #f59e0b 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'heroFadeIn 0.8s ease-out 0.15s both',
    },
    subheading: {
      fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
      color: 'var(--text-secondary)',
      lineHeight: 1.7,
      marginBottom: '2.25rem',
      maxWidth: '600px',
      margin: '0 auto 2.25rem auto',
      animation: 'heroSlideUp 0.8s ease-out 0.35s both',
    },
    cta: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.9rem 2.25rem',
      background: 'var(--accent-gradient)',
      color: '#0a1628',
      fontWeight: 700,
      fontSize: '1rem',
      border: 'none',
      borderRadius: 'var(--radius-xl)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(245,158,11,0.3)',
      animation: 'heroSlideUp 0.8s ease-out 0.5s both',
      letterSpacing: '0.01em',
    },
    // Floating decorative circles
    floatingCircle: (size, top, left, delay, duration) => ({
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.02) 70%, transparent 100%)`,
      border: '1px solid rgba(245,158,11,0.05)',
      top,
      left,
      animation: `heroFloat ${duration}s ease-in-out ${delay}s infinite`,
      pointerEvents: 'none',
      zIndex: 0,
    }),
  };

  const animationCSS = `
    @keyframes heroFadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes heroSlideUp {
      from { opacity: 0; transform: translateY(25px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes heroFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(2deg); }
      66% { transform: translateY(10px) rotate(-1deg); }
    }
    .hero-cta:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 30px rgba(245,158,11,0.45) !important;
    }
    .hero-cta:active {
      transform: translateY(0) !important;
    }
    @media (max-width: 768px) {
      .hero-section { min-height: 50vh !important; }
    }
  `;

  return (
    <>
      <style>{animationCSS}</style>
      <section className="hero-section" style={styles.hero}>
        {/* Overlay gradient */}
        <div style={styles.overlay} />

        {/* Floating circles */}
        <div style={styles.floatingCircle(320, '10%', '5%', 0, 8)} />
        <div style={styles.floatingCircle(220, '60%', '75%', 1.5, 10)} />
        <div style={styles.floatingCircle(400, '25%', '60%', 0.8, 12)} />
        <div style={styles.floatingCircle(180, '70%', '20%', 2, 9)} />

        {/* Content */}
        <div style={styles.content}>
          <p style={styles.eyebrow}>✦ Premium Quality Products ✦</p>
          <h1 style={styles.heading}>
            Welcome to K minutes
          </h1>
          <p style={styles.subheading}>
            Your one-stop shop for daily essentials — delivered to your doorstep via WhatsApp
          </p>
          <button
            className="hero-cta"
            style={styles.cta}
            onClick={scrollToProducts}
          >
            Shop Now ↓
          </button>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
