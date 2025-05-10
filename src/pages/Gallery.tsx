
import { useState, useEffect } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Artwork } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [externalArtworks, setExternalArtworks] = useState<Artwork[]>([]);
  const [loadingExternal, setLoadingExternal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Artworks' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'landscape', name: 'Landscape' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'photography', name: 'Photography' },
    { id: 'floral', name: 'Floral' }
  ];

  const { data: databaseArtworks = [], isLoading, error } = useQuery({
    queryKey: ['artworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('*');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.map(artwork => ({
        id: artwork.id,
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
      }));
    }
  });

  const fetchExternalArtworks = async () => {
    try {
      setLoadingExternal(true);
      // Fetch from Met Museum API (department 11 is Paintings)
      const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=paintings&departmentId=11`);
      const data = await response.json();
      
      // Get 10 random object IDs from the results
      const randomObjectIds = data.objectIDs
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
      
      const artworkPromises = randomObjectIds.map(async (objectId: number) => {
        const detailResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`);
        const artworkData = await detailResponse.json();
        
        // Only include artworks with images
        if (artworkData.primaryImage) {
          return {
            id: `external-${artworkData.objectID}`,
            title: artworkData.title || "Untitled",
            artist: artworkData.artistDisplayName || "Unknown Artist",
            description: artworkData.medium || "",
            price: Math.floor(Math.random() * 500) + 200, // Random price between $200-$700
            imageUrl: artworkData.primaryImage,
            dimensions: {
              width: artworkData.measurements?.length > 0 ? artworkData.measurements[0].elementMeasurements?.width || 30 : 30,
              height: artworkData.measurements?.length > 0 ? artworkData.measurements[0].elementMeasurements?.height || 20 : 20,
            },
            category: determineCategory(artworkData.classification, artworkData.title)
          };
        }
        return null;
      });
      
      const fetchedArtworks = (await Promise.all(artworkPromises)).filter(artwork => artwork !== null) as Artwork[];
      setExternalArtworks(fetchedArtworks);
      toast({
        title: "New artworks loaded",
        description: `Successfully fetched ${fetchedArtworks.length} artworks from the Metropolitan Museum of Art`,
      });
    } catch (error) {
      console.error("Error fetching external artworks:", error);
      toast({
        title: "Error loading artworks",
        description: "Failed to fetch external artworks. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingExternal(false);
    }
  };

  // Helper function to determine category from artwork metadata
  const determineCategory = (classification: string, title: string) => {
    const titleLower = title.toLowerCase();
    const classLower = (classification || "").toLowerCase();
    
    if (classLower.includes("landscape") || titleLower.includes("landscape")) return "landscape";
    if (classLower.includes("portrait") || titleLower.includes("portrait")) return "portrait";
    if (classLower.includes("flower") || titleLower.includes("flower") || 
        classLower.includes("floral") || titleLower.includes("floral")) return "floral";
    if (classLower.includes("photo") || titleLower.includes("photo")) return "photography";
    if (classLower.includes("abstract") || titleLower.includes("abstract")) return "abstract";
    
    // Randomly assign to available categories if can't determine
    const availableCategories = ["abstract", "landscape", "portrait", "photography", "floral"];
    return availableCategories[Math.floor(Math.random() * availableCategories.length)];
  };

  // Load external artworks on initial render
  useEffect(() => {
    fetchExternalArtworks();
  }, []);

  // Combine database and external artworks
  const allArtworks = [...(databaseArtworks || []), ...externalArtworks];
  
  const filteredArtworks = activeCategory === 'all' 
    ? allArtworks 
    : allArtworks.filter(artwork => artwork.category === activeCategory);

  // Calculate pagination
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);
  const paginatedArtworks = filteredArtworks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="py-8 md:py-12">
      <div className="art-container">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Art Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of unique artworks from talented artists around the world.
          </p>
          
          <div className="mt-6">
            <Button 
              onClick={fetchExternalArtworks} 
              disabled={loadingExternal}
              variant="outline"
              className="mx-auto"
            >
              {loadingExternal ? "Loading..." : "Load More Artworks"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <div className="flex justify-center mb-6">
            <TabsList>
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setPage(1); // Reset to first page when changing category
                  }}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {isLoading || loadingExternal ? (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedArtworks.map(artwork => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                  ))}
                </div>
                {filteredArtworks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No artworks found in this category.</p>
                  </div>
                )}
                
                {/* Pagination */}
                {filteredArtworks.length > ITEMS_PER_PAGE && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                          className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setPage(i + 1)}
                            isActive={page === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
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
