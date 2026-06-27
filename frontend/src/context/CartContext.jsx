import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_KEY = 'cart';

/** Returns the localStorage key scoped to a specific user.
 *  Guests use the generic 'cart' key. */
const cartKey = (userId) => (userId ? `cart_user_${userId}` : CART_KEY);

export const CartProvider = ({ children }) => {
  // userId is set externally via setUserId when auth state changes
  const [userId, setUserId]   = useState(null);
  const [cartItems, setCartItems] = useState([]);

  /** Load the correct cart whenever the userId changes */
  useEffect(() => {
    const key   = cartKey(userId);
    const saved = localStorage.getItem(key);
    try {
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch {
      setCartItems([]);
    }
  }, [userId]);

  /** Persist cart to localStorage on every change */
  useEffect(() => {
    const key = cartKey(userId);
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, userId]);

  /** Called by AuthContext on logout — clears state AND storage */
  const clearCart = () => {
    setCartItems([]);
    // Remove ALL cart keys so nothing leaks between users
    Object.keys(localStorage)
      .filter(k => k === CART_KEY || k.startsWith('cart_user_'))
      .forEach(k => localStorage.removeItem(k));
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  };

  const getCartTotal = () =>
    cartItems.reduce(
      (total, item) =>
        total + (item.discount_price ? Number(item.discount_price) : Number(item.price)) * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, setUserId }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
