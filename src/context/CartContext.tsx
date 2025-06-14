import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sizes: string[];
  cartItemId: string;
}

interface DiscountCode {
  code: string;
  percentage: number;
  maxDiscount: number;
}

// Predefined discount codes
const DISCOUNT_CODES: DiscountCode[] = [
  { code: 'WELCOME10', percentage: 10, maxDiscount: 50 },
  { code: 'SUMMER20', percentage: 20, maxDiscount: 100 },
  { code: 'ILLUSION25', percentage: 25, maxDiscount: 150 },
];

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, change: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getDiscountAmount: () => number;
  getCodeDiscountAmount: () => number;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
  activeDiscountCode: DiscountCode | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeDiscountCode, setActiveDiscountCode] = useState<DiscountCode | null>(null);

  const addToCart = (item: Omit<CartItem, 'cartItemId'>) => {
    setCartItems(prevItems => {
      const cartItemId = `${item.id}-${item.sizes.join('-')}`;
      return [...prevItems, { ...item, cartItemId }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const getDiscountAmount = () => {
    const totalTshirts = cartItems.reduce((total, item) => {
      if (item.name.toLowerCase().includes('t-shirt') || item.name.toLowerCase().includes('tshirt')) {
        return total + item.quantity;
      }
      return total;
    }, 0);

    if (totalTshirts >= 8) return 19.92;
    if (totalTshirts >= 6) return 14.94;
    if (totalTshirts >= 4) return 9.96;
    if (totalTshirts >= 2) return 4.98;
    return 0;
  };

  const getCodeDiscountAmount = () => {
    if (!activeDiscountCode) return 0;
    
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tshirtDiscount = getDiscountAmount();
    const discountableAmount = subtotal - tshirtDiscount;
    
    const discountAmount = (discountableAmount * activeDiscountCode.percentage) / 100;
    return Math.min(discountAmount, activeDiscountCode.maxDiscount);
  };

  const getCartTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tshirtDiscount = getDiscountAmount();
    const codeDiscount = getCodeDiscountAmount();
    return subtotal - tshirtDiscount - codeDiscount;
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const applyDiscountCode = (code: string) => {
    const discountCode = DISCOUNT_CODES.find(dc => dc.code.toUpperCase() === code.toUpperCase());
    
    if (!discountCode) {
      return {
        success: false,
        message: 'Invalid discount code'
      };
    }

    setActiveDiscountCode(discountCode);
    return {
      success: true,
      message: `Discount code applied! You'll save ${discountCode.percentage}% (up to $${discountCode.maxDiscount})`
    };
  };

  const removeDiscountCode = () => {
    setActiveDiscountCode(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        getDiscountAmount,
        getCodeDiscountAmount,
        applyDiscountCode,
        removeDiscountCode,
        activeDiscountCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 