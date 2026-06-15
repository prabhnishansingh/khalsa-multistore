import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const pId = product.id || product._id;
      const existing = prev.find((item) => (item.product.id || item.product._id) === pId);
      if (existing) {
        return prev.map((item) =>
          (item.product.id || item.product._id) === pId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    addToast('Added to cart!');
  }, [addToast]);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => (item.product.id || item.product._id) !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => (item.product.id || item.product._id) !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          (item.product.id || item.product._id) === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // Map cartItems to a flattened cart array for components expecting it
  const cart = cartItems.map((item) => ({
    _id: item.product.id || item.product._id,
    id: item.product.id || item.product._id,
    name: item.product.name,
    price: item.product.price,
    image_url: item.product.image_url,
    image: item.product.image || item.product.image_url,
    stock: item.product.stock,
    quantity: item.quantity,
  }));

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
      {/* Toast container */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: 'linear-gradient(135deg, #1a6b3c, #2e8b57)',
              color: '#fff',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              fontSize: '0.95rem',
              fontWeight: 500,
              animation: 'toast-slide-in 0.3s ease-out',
              pointerEvents: 'auto',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toast-slide-in {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

export default CartContext;
