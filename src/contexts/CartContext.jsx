import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from '../components/Toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load from local storage on init
        try {
            const saved = localStorage.getItem('cartItems');
            if (saved) {
                const parsed = JSON.parse(saved);
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (e) {
            console.error("Failed to parse cartItems from localStorage", e);
        }
        return [];
    });

    useEffect(() => {
        // Save to local storage whenever cart changes
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);

    const showToast = (message) => {
        setToastMessage(message);
        setIsToastVisible(true);
    };

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            const qty = Math.max(1, product.quantity || 1);
            return [...prev, { ...product, quantity: qty }];
        });
        showToast(product.name);
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems(prev =>
            prev.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal: cartItems.reduce((sum, item) => {
            const price = Number(item.currentPrice ?? item.price ?? 0) || 0;
            const qty = Number(item.quantity) || 1;
            return sum + price * qty;
        }, 0)
    };

    return (
        <CartContext.Provider value={value}>
            {children}
            <Toast 
                message={toastMessage} 
                isVisible={isToastVisible} 
                onClose={() => setIsToastVisible(false)} 
            />
        </CartContext.Provider>
    );
};
