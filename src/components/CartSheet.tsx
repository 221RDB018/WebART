
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { formatCurrency } from "../utils/formatters";
import { ShoppingCart, X } from "lucide-react";

const CartSheet = () => {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">Your cart is empty</p>
        <Button asChild variant="link" className="mt-2">
          <a href="/gallery">Browse Gallery</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-6">
        {cartItems.map((item, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-start space-x-4">
              <div className="h-24 w-24 overflow-hidden rounded-md border">
                <img
                  src={item.artwork.imageUrl}
                  alt={item.artwork.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.artwork.title}</h4>
                <p className="text-sm text-muted-foreground">{item.artwork.artist}</p>
                <div className="mt-1 text-sm">
                  <p>Size: {item.customDimensions.width}" × {item.customDimensions.height}"</p>
                  {item.frame && <p>Frame: {item.frame.name}</p>}
                </div>
                <p className="mt-1 font-medium">
                  {formatCurrency(
                    item.artwork.price + (item.frame ? item.frame.price : 0)
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeFromCart(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Separator className="my-4" />
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Subtotal</span>
          <span>{formatCurrency(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-sm mb-6">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex flex-col space-y-3">
          <Button className="w-full">Proceed to Checkout</Button>
          <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
        </div>
      </div>
    </div>
  );
};

export default CartSheet;
