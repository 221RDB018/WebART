import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useArtworks } from "../data/artworks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "../utils/formatters";
import { useCart } from "../contexts/CartContext";
import { Frame } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArtworkById, frames } = useArtworks();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const artwork = id ? getArtworkById(id.toString()) : undefined;

  const [selectedFrame, setSelectedFrame] = useState<Frame | undefined>(undefined);
  const [scale, setScale] = useState(1);

  // Calculate dimensions based on scale
  const customWidth = useMemo(() => {
    if (!artwork) return 60;
    return Math.round(artwork.dimensions.width * scale);
  }, [artwork, scale]);

  const customHeight = useMemo(() => {
    if (!artwork) return 90;
    return Math.round(artwork.dimensions.height * scale);
  }, [artwork, scale]);

  // Calculate min and max scale
  const minScale = useMemo(() => {
    if (!artwork) return 0.5;
    return 0.5;
  }, [artwork]);

  const maxScale = useMemo(() => {
    if (!artwork) return 2;
    return 2;
  }, [artwork]);

  if (!artwork) {
    return (
      <div className="art-container py-12 text-center">
        <p>{t('artworkNotFound')}</p>
        <Button variant="link" onClick={() => navigate('/gallery')}>
          {t('returnToGallery')}
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {    
    addToCart(artwork, selectedFrame, customWidth, customHeight);
  };

  const handleFrameSelect = (frameId: string) => {
    const frame = frames.find(f => f.id === frameId);
    setSelectedFrame(frame);
  };

  // Calculate price based on dimensions
  const originalArea = artwork.dimensions.width * artwork.dimensions.height;
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
          <span>{t('back')}</span>
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
            <p className="text-lg text-muted-foreground mb-4">{t('by')} {artwork.artist}</p>
            
            <div className="mb-6">
              <h2 className="font-semibold mb-2">{t('description')}</h2>
              <p className="text-muted-foreground">{artwork.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="font-semibold mb-2">{t('selectFrame')}</h2>
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
                      <span className="text-xs text-muted-foreground">{t('noFrame')}</span>
                    </div>
                    <span className="block w-full text-center font-medium">{t('noFrame')}</span>
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
              <h2 className="font-semibold mb-4">{t('customizeSize')}</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="size-slider">
                      {t('dimensions', { width: customWidth.toString(), height: customHeight.toString() })}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {t('original', { width: artwork.dimensions.width.toString(), height: artwork.dimensions.height.toString() })}
                    </span>
                  </div>
                  <Slider
                    id="size-slider"
                    min={minScale}
                    max={maxScale}
                    step={0.1}
                    value={[scale]}
                    onValueChange={(value) => setScale(value[0])}
                  />
                </div>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <span>{t('artworkWithDimensions', { width: customWidth.toString(), height: customHeight.toString() })}</span>
                  <span>{formatCurrency(adjustedArtPrice)}</span>
                </div>
                {selectedFrame && (
                  <div className="flex justify-between mb-2">
                    <span>{t('frameWithName', { name: selectedFrame.name })}</span>
                    <span>{formatCurrency(selectedFrame.price)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t mt-2 pt-2">
                  <span>{t('total')}</span>
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
                {t('addToCart')}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-1/3"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (selectedFrame) {
                    params.set('frameId', selectedFrame.id);
                  }
                  params.set('width', customWidth.toString());
                  params.set('height', customHeight.toString());
                  navigate(`/ar-preview/${artwork.id}?${params.toString()}`);
                }}
              >
                {t('arPreview')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
