
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArtworkCard from '../components/ArtworkCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Artwork } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '../hooks/use-mobile';
import { artworks as localArtworks } from '../data/artworks'; // Import directly

const Gallery = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const isMobile = useIsMobile();

  const categories = [
    { id: 'all', name: 'All Artworks' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'landscape', name: 'Landscape' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'photography', name: 'Photography' },
    { id: 'floral', name: 'Floral' },
    { id: 'custom', name: 'My Uploads' }
  ];

  const { data: artworks = [], isLoading, error } = useQuery({
    queryKey: ['artworks'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*');
        
        if (error) {
          throw new Error(error.message);
        }

        // Return data from Supabase if available, otherwise return an empty array
        return data ? data.map(artwork => ({
          id: artwork.id.toString(), // Ensure ID is a string
          title: artwork.title,
          artist: artwork.artist,
          description: artwork.description || '',
          price: Number(artwork.price),
          imageUrl: artwork.image_url,
          dimensions: {
            width: artwork.width,
            height: artwork.height,
          },
          category: artwork.category
        })) : [];
      } catch (error) {
        console.error("Error fetching artworks from Supabase:", error);
        // Return empty array on error to avoid breaking the UI
        return [];
      }
    },
    // Don't keep retrying if there's an error
    retry: 1,
  });

  // Use local data if Supabase fetch fails
  // Ensure all local artwork IDs are strings
  const allArtworks = artworks.length > 0 ? artworks : localArtworks.map(art => ({
    ...art,
    id: art.id.toString() // Convert all IDs to strings to ensure consistency
  }));

  const filteredArtworks = activeCategory === 'all' 
    ? allArtworks 
    : allArtworks.filter(artwork => artwork.category === activeCategory);

  return (
    <div className="py-6 md:py-12">
      <div className="art-container">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-serif mb-3">Art Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-5 px-4">
            Explore our curated collection of unique artworks from talented artists around the world.
          </p>
          <Button 
            onClick={() => navigate('/upload-artwork')} 
            className="flex items-center gap-2"
          >
            <Upload size={18} />
            Upload Your Artwork
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <div className="flex justify-center mb-6 overflow-x-auto pb-2">
            <TabsList className={isMobile ? "w-full overflow-x-auto" : ""}>
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={isMobile ? "min-w-fit" : ""}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading artworks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>Error loading artworks. Please try again later.</p>
            </div>
          ) : (
            categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredArtworks.map(artwork => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                  ))}
                </div>
                {filteredArtworks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No artworks found in this category.</p>
                    {category.id === 'custom' && (
                      <Button 
                        onClick={() => navigate('/upload-artwork')} 
                        className="flex items-center gap-2"
                      >
                        <Upload size={18} />
                        Upload Your First Artwork
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            ))
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Gallery;
