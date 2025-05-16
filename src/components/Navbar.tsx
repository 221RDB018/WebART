
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import CartSheet from "./CartSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="art-container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-serif text-2xl font-semibold text-art-dark">
              WebART
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-art-purple transition-colors">
              {t('home')}
            </Link>
            <Link to="/gallery" className="font-medium hover:text-art-purple transition-colors">
              {t('gallery')}
            </Link>
{/*             <Link to="/about" className="font-medium hover:text-art-purple transition-colors">
              About
            </Link>
            <Link to="/contact" className="font-medium hover:text-art-purple transition-colors">
              Contact
            </Link> */}
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">{t('signIn')}</Link>
              </Button>
            )}

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
                  <SheetTitle>{t('yourCart')}</SheetTitle>
                  <SheetDescription>
                    {t('reviewItems')}
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
                {t('home')}
              </Link>
              <Separator />
              <Link to="/gallery" className="font-medium py-2 hover:text-art-purple transition-colors">
                {t('gallery')}
              </Link>
              {/* <Separator />
              <Link to="/about" className="font-medium py-2 hover:text-art-purple transition-colors">
                About
              </Link>
              <Separator />
              <Link to="/contact" className="font-medium py-2 hover:text-art-purple transition-colors">
                Contact
              </Link> */}
              {!user && (
                <>
                  <Separator />
                  <Link to="/auth" className="font-medium py-2 hover:text-art-purple transition-colors">
                    {t('signIn')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
