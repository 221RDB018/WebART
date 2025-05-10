
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getArtworkById, getFrameById } from "../data/artworks";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ArPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const frameId = searchParams.get('frame');

  const artwork = id ? getArtworkById(id) : undefined;
  const frame = frameId ? getFrameById(frameId) : undefined;

  if (!artwork) {
    return (
      <div className="art-container py-12 text-center">
        <p>Artwork not found.</p>
        <Button variant="link" onClick={() => navigate('/gallery')}>
          Return to Gallery
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="art-container">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">WebAR Experience</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This feature will allow you to visualize "{artwork.title}" on your wall using augmented reality. Coming soon!
          </p>
        </div>
        
        <div className="bg-art-light rounded-xl p-8 mb-8 text-center">
          <div className="max-w-md mx-auto">
            {/* Display artwork with frame if selected */}
            <div className="relative inline-block mb-6">
              {frame && (
                <div 
                  className="absolute inset-0 border-8 rounded-sm" 
                  style={{ borderColor: frame.color }}
                />
              )}
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="h-64 object-contain mx-auto relative"
              />
            </div>
            
            <h2 className="text-xl font-serif font-medium mb-2">{artwork.title}</h2>
            <p className="text-muted-foreground mb-4">by {artwork.artist}</p>
            
            {frame && (
              <p className="text-sm mb-4">Frame: {frame.name}</p>
            )}
            
            <Button 
              disabled
              className="w-full mb-3"
              variant="default"
            >
              Launch WebAR Experience
            </Button>
            <p className="text-sm text-muted-foreground">
              WebAR functionality will be implemented in a future update. This placeholder demonstrates how the feature will integrate into your art selection process.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-serif text-xl mb-4">How it will work</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-art-light h-6 w-6 mr-3 text-sm font-medium">1</span>
                <span>Point your camera at your wall</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-art-light h-6 w-6 mr-3 text-sm font-medium">2</span>
                <span>The app will detect the flat surface</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-art-light h-6 w-6 mr-3 text-sm font-medium">3</span>
                <span>Visualize the artwork with your selected frame and size</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-art-light h-6 w-6 mr-3 text-sm font-medium">4</span>
                <span>Adjust the position by dragging on your screen</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-serif text-xl mb-4">Coming Soon</h3>
            <p className="mb-4">Our WebAR experience will let you:</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Visualize artwork in true-to-size dimensions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>See how different frames look in your space</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Take photos to save or share with others</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Compare multiple artworks side by side</span>
              </li>
            </ul>
            <Button
              variant="outline"
              onClick={() => navigate(`/artwork/${artwork.id}`)}
              className="w-full"
            >
              Back to Artwork Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArPreview;
