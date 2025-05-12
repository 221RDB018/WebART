import React, { createContext, useContext, useState, ReactNode } from "react";
import { Artwork, CartItem, Frame } from "../types";
import { getFrameById } from "../data/artworks";

interface CartContextProps {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (artwork: Artwork, frame?: Frame, customWidth?: number, customHeight?: number) => void;
  removeFromCart: (artworkId: string, frameId?: string) => void;
  clearCart: () => void;
  increaseQuantity: (artworkId: string, frameId?: string) => void;
  decreaseQuantity: (artworkId: string, frameId?: string) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (artwork: Artwork, frame?: Frame, customWidth: number = artwork.dimensions.width, customHeight: number = artwork.dimensions.height) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.artwork.id === artwork.id && (frame ? item.frame?.id === frame.id : !item.frame) &&
        item.customDimensions.width === customWidth && item.customDimensions.height === customHeight
      );
  
      if (existingItemIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        const newItem: CartItem = {
          artwork: artwork,
          frame: frame,
          customDimensions: {
            width: customWidth,
            height: customHeight,
          },
          quantity: 1,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (artworkId: string, frameId?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(item => !(item.artwork.id === artworkId && (frameId ? item.frame?.id === frameId : !item.frame)))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const increaseQuantity = (artworkId: string, frameId?: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.artwork.id === artworkId && (frameId ? item.frame?.id === frameId : !item.frame)) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (artworkId: string, frameId?: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.artwork.id === artworkId && (frameId ? item.frame?.id === frameId : !item.frame) && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value: CartContextProps = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
