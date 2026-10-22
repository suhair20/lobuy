"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "@/lib/api";
import type { Cart, CartProduct, Product } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

const GUEST_CART_KEY = "lobuy_guest_cart";

type GuestItem = {
  _id: string;
  productId: Product;
  quantity: number;
  price: number;
  totalPrice: number;
};

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  count: number;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQty: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

function readGuestCart(): Cart {
  if (typeof window === "undefined") return { products: [] };
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return { products: [] };
    const items = JSON.parse(raw) as GuestItem[];
    return { products: items };
  } catch {
    return { products: [] };
  }
}

function writeGuestCart(products: GuestItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(products));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(readGuestCart());
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch<Cart>("/api/user/cart");
      setCart(data);
    } catch {
      setCart({ products: [] });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      void refreshCart();
    }
  }, [authLoading, refreshCart]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      if (isAuthenticated) {
        await apiFetch("/api/user/cart/add", {
          method: "POST",
          body: JSON.stringify({ productId, quantity }),
        });
        await refreshCart();
        return;
      }

      // Guest cart — fetch product details, store in localStorage
      const product = await apiFetch<Product>(`/api/user/productbyId/${productId}`);
      const guest = readGuestCart();
      const products = [...(guest.products as GuestItem[])];
      const idx = products.findIndex((p) => p.productId._id === productId);

      if (idx >= 0) {
        products[idx].quantity += quantity;
        products[idx].totalPrice = products[idx].quantity * products[idx].price;
      } else {
        products.push({
          _id: `guest-${productId}`,
          productId: product,
          quantity,
          price: product.price,
          totalPrice: product.price * quantity,
        });
      }

      writeGuestCart(products);
      setCart({ products });
    },
    [isAuthenticated, refreshCart]
  );

  const updateQty = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) return;

      if (isAuthenticated) {
        await apiFetch("/api/user/cart/update", {
          method: "PUT",
          body: JSON.stringify({ productId, quantity }),
        });
        await refreshCart();
        return;
      }

      const products = (readGuestCart().products as GuestItem[]).map((p) => {
        if (p.productId._id !== productId) return p;
        return {
          ...p,
          quantity,
          totalPrice: quantity * p.price,
        };
      });
      writeGuestCart(products);
      setCart({ products });
    },
    [isAuthenticated, refreshCart]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        await apiFetch(`/api/user/cart/remove/${productId}`, { method: "DELETE" });
        await refreshCart();
        return;
      }

      const products = (readGuestCart().products as GuestItem[]).filter(
        (p) => p.productId._id !== productId
      );
      writeGuestCart(products);
      setCart({ products });
    },
    [isAuthenticated, refreshCart]
  );

  const count =
    cart?.products?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;

  const value = useMemo(
    () => ({
      cart,
      loading,
      count,
      refreshCart,
      addToCart,
      updateQty,
      removeFromCart,
    }),
    [cart, loading, count, refreshCart, addToCart, updateQty, removeFromCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
