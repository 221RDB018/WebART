import React from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useArtworks } from "../data/artworks";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

const ArPreview: React.FC = () => {
  const { id, frameId } = useParams<{ id: string; frameId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const width = searchParams.get('width');
  const height = searchParams.get('height');
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const { getArtworkById, getFrameById } = useArtworks();

  const artwork = id ? getArtworkById(id) : undefined;
  const frame = frameId ? getFrameById(frameId) : undefined;

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
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">{t('webARExperience')}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('experienceDescription', { title: artwork.title })}
          </p>
        </div>
        
        <div className="bg-art-light rounded-xl p-8 mb-8 text-center">
        <div className="w-full max-w-md mx-auto">
          {/* Display artwork with frame if selected */}
          <div
            className="inline-block border-8 rounded-sm mx-auto"
            style={{ borderColor: frame?.color || 'transparent' }}
          >
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="block w-full h-auto object-contain"
            />
          </div>
            
            <h2 className="text-xl font-serif font-medium mb-2">{artwork.title}</h2>
            <p className="text-muted-foreground mb-4">{t('by')} {artwork.artist}</p>
            
            {frame && (
              <p className="text-sm mb-4">{t('frame')} {frame.name}</p>
            )}
            
            <Button 
              onClick={() => {
                const params = new URLSearchParams();
                params.set('artworkId', artwork.id);
                if (frame) {
                  params.set('frameId', frame.id);
                }
                if (width) {
                  params.set('width', width);
                }
                if (height) {
                  params.set('height', height);
                }
                window.location.href = `/index-webar.html?${params.toString()}`;
              }}
              className="w-full mb-3"
              variant="default"
            >
              {t('launchAR')}
            </Button>

          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-serif text-xl mb-4">{t('howItWorks')}</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-art-light h-6 w-6 mr-3 text-sm font-medium">1</span>
                <span>{t('pointCamera')}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-art-light h-6 w-6 mr-3 text-sm font-medium">2</span>
                <span>{t('detectSurface')}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-art-light h-6 w-6 mr-3 text-sm font-medium">3</span>
                <span>{t('visualizeArtwork')}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-art-light h-6 w-6 mr-3 text-sm font-medium">4</span>
                <span>{t('adjustPosition')}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-serif text-xl mb-4">{t('videoTutorial')}</h3>
            <div className="relative rounded-lg overflow-hidden bg-art-dark aspect-video mb-4">
              {/* Video placeholder - replace with actual video embed when available */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-art-purple/80 rounded-full p-3 backdrop-blur-sm">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <img 
                src={artwork.imageUrl} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover opacity-50"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t('watchTutorial')}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate(`/artwork/${artwork.id}`)}
              className="w-full"
            >
              {t('backToDetails')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArPreview;
