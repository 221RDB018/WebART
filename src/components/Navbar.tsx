
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import CartSheet from "./CartSheet";

const Navbar = () => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="art-container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-serif text-2xl font-semibold text-art-dark">
              ArtCanvas
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-art-purple transition-colors">
              Home
            </Link>
            <Link to="/gallery" className="font-medium hover:text-art-purple transition-colors">
              Gallery
            </Link>
            <Link to="/about" className="font-medium hover:text-art-purple transition-colors">
              About
            </Link>
            <Link to="/contact" className="font-medium hover:text-art-purple transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-art-purple text-white text-xs flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                  <SheetDescription>
                    Review your selected items
                  </SheetDescription>
                </SheetHeader>
                <CartSheet />
              </SheetContent>
            </Sheet>
            
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2">
          <div className="art-container">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="font-medium py-2 hover:text-art-purple transition-colors">
                Home
              </Link>
              <Separator />
              <Link to="/gallery" className="font-medium py-2 hover:text-art-purple transition-colors">
                Gallery
              </Link>
              <Separator />
              <Link to="/about" className="font-medium py-2 hover:text-art-purple transition-colors">
                About
              </Link>
              <Separator />
              <Link to="/contact" className="font-medium py-2 hover:text-art-purple transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
