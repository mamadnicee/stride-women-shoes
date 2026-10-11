import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { getProduct, fmtUSD } from "../data/products";
import { useShop } from "../store";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem, total } = useShop();
  const itemCount = cart.reduce((count, item) => count + item.qty, 0);

  useEffect(() => {
    if (!cartOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setCartOpen(false);
      }}
    >
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="drawer-head">
          <div>
            <span className="eyebrow">YOUR EDIT</span>
            <h2 id="cart-drawer-title">
              Shopping bag <small>({itemCount})</small>
            </h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setCartOpen(false)}
            aria-label="Close shopping bag"
            title="Close cart"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={34} aria-hidden="true" />
            <h3>Your next favourite is out there.</h3>
            <p lang="fa" dir="rtl">کیفت هنوز خالیه — وقتشه یه قدم تازه برداری.</p>
            <Link
              className="button button-dark"
              to="/shop"
              onClick={() => setCartOpen(false)}
            >
              Explore the shop <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items" aria-label="Items in your shopping bag">
              {cart.map((item) => {
                const product = getProduct(item.id);
                if (!product) return null;

                return (
                  <div className="cart-item" key={`${item.id}-${item.size}`}>
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <div className="cart-item-copy">
                      <Link
                        to={`/product/${product.id}`}
                        onClick={() => setCartOpen(false)}
                      >
                        <b>{product.name}</b>
                      </Link>
                      <span>{product.color} · Size {item.size}</span>
                      <strong>{fmtUSD(product.price * item.qty)}</strong>
                      <div className="qty-control" aria-label={`Quantity for ${product.name}`}>
                        <button
                          type="button"
                          title="Decrease quantity"
                          aria-label={`Decrease ${product.name} quantity`}
                          onClick={() => updateQty(item.id, item.size, -1)}
                        >
                          <Minus size={13} aria-hidden="true" />
                        </button>
                        <span aria-live="polite">{item.qty}</span>
                        <button
                          type="button"
                          title="Increase quantity"
                          aria-label={`Increase ${product.name} quantity`}
                          onClick={() => updateQty(item.id, item.size, 1)}
                        >
                          <Plus size={13} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          title="Remove item"
                          aria-label={`Remove ${product.name} from shopping bag`}
                          onClick={() => removeItem(item.id, item.size)}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-bottom">
              <div className="subtotal">
                <span>
                  Subtotal <small>· shipping calculated at checkout</small>
                </span>
                <b>{fmtUSD(total)}</b>
              </div>
              <button
                type="button"
                className="button button-lime checkout"
                title="Demo checkout"
                onClick={() => window.alert("Checkout demo — your bag is saved locally.\nسبد خرید شما ذخیره شد.")}
              >
                Continue to checkout <ArrowRight size={17} aria-hidden="true" />
              </button>
              <p>Secure checkout · Free shipping over $150</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
