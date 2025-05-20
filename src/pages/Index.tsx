import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image } from "lucide-react";
import { useArtworks } from "../contexts/ArtworksContext";
import ArtworkCard from "../components/ArtworkCard";
import { useIsMobile } from "../hooks/use-mobile";
import { useLanguage } from "../contexts/LanguageContext";

const Index: React.FC = () => {
  const { artworks } = useArtworks();
  const featuredArtworks = artworks.slice(0, 3);
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-art-light py-12 md:py-24">
        <div className="art-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold mb-4 leading-tight">
                {t('findArtThatSpeaks')}
              </h1>
              <p className="text-lg mb-6 text-muted-foreground max-w-md md:mx-0 mx-auto px-4 md:px-0">
                {t('discoverUniqueArtworks')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="px-6 md:px-8">
                  <Link to="/gallery">{t('exploreGallery')}</Link>
                </Button>
              </div>
            </div>
            <div className={`relative ${isMobile ? 'mt-8 flex justify-center' : 'hidden md:block'}`}>
              {isMobile ? (
                <div className="relative w-64 h-64">
                  <img 
                    src="/abstract-1.jpg" 
                    alt="Artwork showcase" 
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <>
                  <div className="absolute -top-6 -left-6 w-64 h-64 bg-white rounded-lg shadow-lg overflow-hidden">
                    <img 
                      src="/abstract-1.jpg" 
                      alt="Abstract artwork" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-12 left-32 w-72 h-72 bg-white rounded-lg shadow-lg overflow-hidden z-10">
                    <img 
                      src="/landscape-1.jpg" 
                      alt="Landscape artwork" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 left-12 w-56 h-56 bg-white rounded-lg shadow-lg overflow-hidden">
                    <img 
                      src="/portrait-1.jpg" 
                      alt="Portrait artwork" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-24">
        <div className="art-container px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-4xl font-medium mb-4">{t('howItWorksTitle')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('platformDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="inline-flex items-center justify-center rounded-full bg-art-light h-16 w-16 mb-4">
                <Image className="h-8 w-8 text-art-purple" />
              </div>
              <h3 className="font-serif text-xl mb-3">{t('browseArtwork')}</h3>
              <p className="text-muted-foreground">
                {t('browseDescription')}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="inline-flex items-center justify-center rounded-full bg-art-light h-16 w-16 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-art-purple">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">{t('customize')}</h3>
              <p className="text-muted-foreground">
                {t('customizeDescription')}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="inline-flex items-center justify-center rounded-full bg-art-light h-16 w-16 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-art-purple">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">{t('visualize')}</h3>
              <p className="text-muted-foreground">
                {t('visualizeDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Artwork Section */}
      <section className="bg-white py-12 md:py-24">
        <div className="art-container px-4 md:px-8">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-medium">{t('featuredArtwork')}</h2>
            <Link to="/gallery" className="text-art-purple hover:underline flex items-center gap-1 text-sm md:text-base">
              {t('viewAll')} <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {featuredArtworks.map(artwork => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-art-purple/10">
        <div className="art-container px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-4xl font-medium mb-4">
              {t('readyToTransform')}
            </h2>
            <p className="text-muted-foreground mb-6 md:mb-8 text-base md:text-lg">
              {t('exploreCollection')}
            </p>
            <Button asChild size="lg" className="px-6 md:px-8">
              <Link to="/gallery">{t('browseGallery')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
