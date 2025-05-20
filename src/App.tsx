
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ArtworksProvider } from "./contexts/ArtworksContext";
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ArtworksProvider>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <BrowserRouter>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/artwork/:id" element={<ArtworkDetail />} />
                        <Route path="/ar-preview/:id" element={<ArPreview />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                        <Route path="/upload-artwork" element={<UploadArtwork />} />
                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </BrowserRouter>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </ArtworksProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
