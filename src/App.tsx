
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Gallery from "./pages/Gallery";
import ArtworkDetail from "./pages/ArtworkDetail";
import ArPreview from "./pages/ArPreview";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import RequireAuth from "./components/RequireAuth";
import UploadArtwork from "./pages/UploadArtwork";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/artwork/:id" element={<ArtworkDetail />} />
                <Route path="/ar-preview/:id" element={<ArPreview />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/upload-artwork" element={<UploadArtwork />} />
                <Route 
                  path="/profile" 
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
