
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getArtworkById, frames } from "../data/artworks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "../utils/formatters";
import { useCart } from "../contexts/CartContext";
import { Frame } from "../types";

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const artwork = id ? getArtworkById(id) : undefined;

  // Convert inches to cm for display
  const initialWidthInCm = artwork ? Math.round(artwork.dimensions.width * 2.54) : 60;
  const initialHeightInCm = artwork ? Math.round(artwork.dimensions.height * 2.54) : 90;

  const [selectedFrame, setSelectedFrame] = useState<Frame | undefined>(undefined);
  const [customWidth, setCustomWidth] = useState(initialWidthInCm);
  const [customHeight, setCustomHeight] = useState(initialHeightInCm);

  // Calculate min and max dimensions in centimeters
  const minWidthInCm = useMemo(() => {
    if (!artwork) return 20;
    return Math.max(20, Math.floor(artwork.dimensions.width * 2.54 * 0.5));
  }, [artwork]);

  const maxWidthInCm = useMemo(() => {
    if (!artwork) return 150;
    return Math.ceil(artwork.dimensions.width * 2.54 * 2);
  }, [artwork]);

  const minHeightInCm = useMemo(() => {
    if (!artwork) return 20;
    return Math.max(20, Math.floor(artwork.dimensions.height * 2.54 * 0.5));
  }, [artwork]);

  const maxHeightInCm = useMemo(() => {
    if (!artwork) return 150;
    return Math.ceil(artwork.dimensions.height * 2.54 * 2);
  }, [artwork]);

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

  const handleAddToCart = () => {
    // Convert cm back to inches for storage
    const widthInInches = customWidth / 2.54;
    const heightInInches = customHeight / 2.54;
    
    addToCart(artwork, selectedFrame, widthInInches, heightInInches);
  };

  const handleFrameSelect = (frameId: string) => {
    const frame = frames.find(f => f.id === frameId);
    setSelectedFrame(frame);
  };

  // Calculate price based on dimensions (simplified version)
  // Original dimensions in inches converted to cm for proper ratio calculation
  const originalArea = (artwork.dimensions.width * 2.54) * (artwork.dimensions.height * 2.54);
  const customArea = customWidth * customHeight;
  const sizeFactor = customArea / originalArea;
  
  const adjustedArtPrice = artwork.price * sizeFactor;
  const framePrice = selectedFrame ? selectedFrame.price : 0;
  const totalPrice = adjustedArtPrice + framePrice;

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative overflow-hidden rounded-lg border shadow-sm">
            <div className="aspect-square md:aspect-auto md:h-full bg-gray-100">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-serif font-medium mb-2">{artwork.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">by {artwork.artist}</p>
            
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{artwork.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Select Frame</h2>
              <RadioGroup className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem
                    id="no-frame"
                    value="no-frame"
                    checked={!selectedFrame}
                    onClick={() => setSelectedFrame(undefined)}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="no-frame"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 h-16 w-16 rounded border flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No Frame</span>
                    </div>
                    <span className="block w-full text-center font-medium">No Frame</span>
                  </Label>
                </div>
                
                {frames.map((frame) => (
                  <div key={frame.id}>
                    <RadioGroupItem
                      id={frame.id}
                      value={frame.id}
                      checked={selectedFrame?.id === frame.id}
                      onClick={() => handleFrameSelect(frame.id)}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={frame.id}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div 
                        className="mb-2 h-16 w-16 rounded border-4" 
                        style={{ borderColor: frame.color }}
                      />
                      <span className="block w-full text-center font-medium">{frame.name}</span>
                      <span className="block w-full text-center text-sm text-muted-foreground">
                        {formatCurrency(frame.price)}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="mb-6">
              <h2 className="font-semibold mb-4">Customize Dimensions</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="width-slider">Width: {customWidth} cm</Label>
                    <span className="text-sm text-muted-foreground">
                      Original: {Math.round(artwork.dimensions.width * 2.54)} cm
                    </span>
                  </div>
                  <Slider
                    id="width-slider"
                    min={minWidthInCm}
                    max={maxWidthInCm}
                    step={1}
                    value={[customWidth]}
                    onValueChange={(value) => setCustomWidth(value[0])}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="height-slider">Height: {customHeight} cm</Label>
                    <span className="text-sm text-muted-foreground">
                      Original: {Math.round(artwork.dimensions.height * 2.54)} cm
                    </span>
                  </div>
                  <Slider
                    id="height-slider"
                    min={minHeightInCm}
                    max={maxHeightInCm}
                    step={1}
                    value={[customHeight]}
                    onValueChange={(value) => setCustomHeight(value[0])}
                  />
                </div>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <span>Artwork ({customWidth} × {customHeight} cm)</span>
                  <span>{formatCurrency(adjustedArtPrice)}</span>
                </div>
                {selectedFrame && (
                  <div className="flex justify-between mb-2">
                    <span>Frame ({selectedFrame.name})</span>
                    <span>{formatCurrency(selectedFrame.price)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t mt-2 pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Button 
                size="lg" 
                className="w-full sm:w-2/3"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-1/3"
                onClick={() => navigate('/ar-preview/' + artwork.id + (selectedFrame ? `?frame=${selectedFrame.id}` : ''))}
              >
                AR Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
