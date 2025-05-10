
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Artwork, Frame } from '../types';
import { getArtworkById, getFrameById } from '../data/artworks';
import { toast } from 'sonner';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (artwork: Artwork, frame: Frame | undefined, width: number, height: number) => void;
  removeFromCart: (itemIndex: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (artwork: Artwork, frame: Frame | undefined, width: number, height: number) => {
    const newItem: CartItem = {
      artwork,
      frame,
      customDimensions: {
        width,
        height
      },
      quantity: 1
    };
    
    setCartItems(prev => [...prev, newItem]);
    toast.success(`${artwork.title} added to cart`);
  };

  const removeFromCart = (itemIndex: number) => {
    setCartItems(prev => prev.filter((_, index) => index !== itemIndex));
    toast.info("Item removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const artworkPrice = item.artwork.price;
    const framePrice = item.frame ? item.frame.price : 0;
    
    // Calculate price based on dimensions (simplified version)
    const originalArea = item.artwork.dimensions.width * item.artwork.dimensions.height;
    const customArea = item.customDimensions.width * item.customDimensions.height;
    const sizeFactor = customArea / originalArea;
    
    const adjustedPrice = artworkPrice * sizeFactor;
    
    return total + (adjustedPrice + framePrice) * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
