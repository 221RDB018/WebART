
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { useArtworks } from '../contexts/ArtworksContext';
import ArtworkCard from '../components/ArtworkCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../contexts/LanguageContext';
import { useIsMobile } from '../hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const { artworks } = useArtworks();
  const [activeCategory, setActiveCategory] = useState('all');
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const categories = [
    { id: 'all', name: t('allArtworks') },
    { id: 'abstract', name: t('abstract') },
    { id: 'landscape', name: t('landscape') },
    { id: 'portrait', name: t('portrait') },
    { id: 'photography', name: t('photography') },
    { id: 'floral', name: t('floral') },
    { id: 'custom', name: t('myUploads') }
  ];

  // Use local data directly instead of fetching from Supabase
  const allArtworks = artworks.map(art => ({
    ...art,
    id: art.id.toString() // Ensure all IDs are strings for consistency
  }));

  const filteredArtworks = activeCategory === 'all' 
    ? allArtworks 
    : allArtworks.filter(artwork => artwork.category === activeCategory);

  return (
    <div className="py-6 md:py-12">
      <div className="art-container">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-serif mb-3">{t('artGallery')}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-5 px-4">
            {t('galleryDescription')}
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/upload-artwork')} 
              className="flex items-center gap-2"
            >
              <Upload size={18} />
              {t('uploadYourArtwork')}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          {isMobile ? (
            <div className="mb-6">
              <ScrollArea className="w-full">
                <div className="py-1">
                  <TabsList className="flex w-max">
                    {categories.map(category => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className="min-w-fit"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <TabsList>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          )}
          
          <div>
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredArtworks.map(artwork => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                  ))}
                </div>
                {filteredArtworks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">{t('noArtworksFound')}</p>
                    {category.id === 'custom' && (
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => navigate('/upload-artwork')} 
                          className="flex items-center gap-2"
                        >
                          <Upload size={18} />
                          {t('uploadFirstArtwork')}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Gallery;
