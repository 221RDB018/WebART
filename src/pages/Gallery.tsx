
import { useState } from 'react';
import { artworks } from '../data/artworks';
import ArtworkCard from '../components/ArtworkCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Artworks' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'landscape', name: 'Landscape' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'photography', name: 'Photography' },
    { id: 'floral', name: 'Floral' }
  ];

  const filteredArtworks = activeCategory === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === activeCategory);

  return (
    <div className="py-8 md:py-12">
      <div className="art-container">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Art Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of unique artworks from talented artists around the world.
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8">
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
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredArtworks.map(artwork => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
              {filteredArtworks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No artworks found in this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Gallery;
