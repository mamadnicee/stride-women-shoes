import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getProduct } from "./data/products";

export type CartItem = {
  id: string;
  size: number;
  qty: number;
};

type StoredShopData = {
  cart?: CartItem[];
  wishlist?: string[];
};

type ShopCtx = {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  addToCart: (id: string, size: number, qty?: number) => void;
  updateQty: (id: string, size: number, delta: number) => void;
  removeItem: (id: string, size: number) => void;
  toggleWish: (id: string) => void;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  count: number;
  total: number;
};

const C = createContext<ShopCtx | null>(null);

const load = (): StoredShopData => {
  try {
    const saved = localStorage.getItem("stride-shop");

    if (!saved) {
      return {};
    }

    return JSON.parse(saved) as StoredShopData;
  } catch {
    return {};
  }
};

export function ShopProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const init = load();

  const [cart, setCart] = useState<CartItem[]>(init.cart ?? []);
  const [wishlist, setWishlist] = useState<string[]>(
    init.wishlist ?? [],
  );
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(
      "stride-shop",
      JSON.stringify({
        cart,
        wishlist,
      }),
    );
  }, [cart, wishlist]);

  const addToCart = (
    id: string,
    size: number,
    qty: number = 1,
  ): void => {
    setCart((currentCart) => {
      const existingIndex = currentCart.findIndex(
        (item) => item.id === id && item.size === size,
      );

      if (existingIndex !== -1) {
        const updatedCart = [...currentCart];
        const existingItem = updatedCart[existingIndex];

        updatedCart[existingIndex] = {
          ...existingItem,
          qty: existingItem.qty + qty,
        };

        return updatedCart;
      }

      return [
        ...currentCart,
        {
          id,
          size,
          qty,
        },
      ];
    });
  };

  const updateQty = (
    id: string,
    size: number,
    delta: number,
  ): void => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id && item.size === size
          ? {
              ...item,
              qty: Math.max(1, item.qty + delta),
            }
          : item,
      ),
    );
  };

  const removeItem = (id: string, size: number): void => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => !(item.id === id && item.size === size),
      ),
    );
  };

  const toggleWish = (id: string): void => {
    setWishlist((currentWishlist) =>
      currentWishlist.includes(id)
        ? currentWishlist.filter((itemId) => itemId !== id)
        : [...currentWishlist, id],
    );
  };

  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0,
  );

  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    const price = product?.price ?? 0;

    return sum + item.qty * price;
  }, 0);

  return (
    <C.Provider
      value={{
        cart,
        wishlist,
        cartOpen,
        addToCart,
        updateQty,
        removeItem,
        toggleWish,
        setCartOpen,
        count,
        total,
      }}
    >
      {children}
    </C.Provider>
  );
}

export const useShop = (): ShopCtx => {
  const context = useContext(C);

  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }

  return context;
};
