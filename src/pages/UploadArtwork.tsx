import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useArtworks } from "../contexts/ArtworksContext";
import { useLanguage } from "../contexts/LanguageContext";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const pixelsPerCm = 37.8;
      const width = Math.round(img.width / pixelsPerCm)*5;
      const height = Math.round(img.height / pixelsPerCm)*5;
      resolve({ width, height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const UploadArtwork: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { artworks, setArtworks } = useArtworks();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState({
    width: 40,  
    height: 50  
  });
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; 

  useEffect(() => {
    const savedArtworks = localStorage.getItem('savedArtworks');
    if (savedArtworks) {
      const parsedArtworks = JSON.parse(savedArtworks);
      artworks.length = 0; 
      artworks.push(...parsedArtworks); 
    }

    const webarArtworks = localStorage.getItem('webarArtworks');
    if (!webarArtworks) {
      const initialData = artworks.reduce((acc, artwork) => {
        acc[artwork.id] = {
          id: artwork.id,
          title: artwork.title,
          artist: artwork.artist,
          imageUrl: artwork.imageUrl,
          dimensions: artwork.dimensions
        };
        return acc;
      }, {});
      localStorage.setItem('webarArtworks', JSON.stringify(initialData));
    }
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: t('error'),
          description: t('imageSizeError'),
          variant: "destructive"
        });
        return;
      }

      setImageFile(file);
      
      try {
        const compressedImage = await compressImage(file);
        setImagePreview(compressedImage);
        
        const { width, height } = await getImageDimensions(file);
        setDimensions({ width, height });
      } catch (error) {
        console.error('Error processing image:', error);
        toast({
          title: t('error'),
          description: t('dimensionsError'),
          variant: "destructive"
        });
      }
    }
  };

  const updateWebARData = (newArtwork: any) => {
    try {
      const webarArtworks = JSON.parse(localStorage.getItem('webarArtworks') || '{}');
      webarArtworks[newArtwork.id] = {
        id: newArtwork.id,
        title: newArtwork.title,
        artist: newArtwork.artist,
        imageUrl: newArtwork.imageUrl,
        dimensions: newArtwork.dimensions
      };
      localStorage.setItem('webarArtworks', JSON.stringify(webarArtworks));
    } catch (error) {
      console.error('Error updating WebAR data:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile || !title || !artist || !description || price <= 0) {
      toast({
        title: t('missingInformation'),
        description: t('fillAllFields'),
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const newId = uuidv4();
      const imageBase64 = imagePreview || await compressImage(imageFile);
    
      const newArtwork = {
        id: newId,
        title,
        artist,
        description,
        price,
        imageUrl: imageBase64,
        dimensions: {
          width: dimensions.width,
          height: dimensions.height
        },
        category: "custom"
      };
    
      const updatedArtworks = [newArtwork, ...artworks];
      setArtworks(updatedArtworks);
      
      localStorage.setItem('savedArtworks', JSON.stringify(updatedArtworks));
      
      updateWebARData(newArtwork);
    
      toast({
        title: t('uploadSuccess'),
        description: t('addedToGallery'),
      });
    
      setTimeout(() => {
        setIsUploading(false);
        navigate(`/artwork/${newId}`);
      }, 1000);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: t('uploadError'),
        description: t('tryAgain'),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="py-8 md:py-12">
      <div className="art-container max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-6 text-center">{t('uploadArtwork')}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('artworkTitle')}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('enterArtworkTitle')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="artist">{t('artistName')}</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder={t('enterArtistName')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">{t('price')}</Label>
                <Input
                  id="price"
                  type="number"
                  value={price.toString()}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder={t('enterPrice')}
                  min="1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">{t('width')}</Label>
                  <Input
                    id="width"
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({...dimensions, width: Number(e.target.value)})}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="height">{t('height')}</Label>
                  <Input
                    id="height"
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({...dimensions, height: Number(e.target.value)})}
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('enterDescription')}
                  rows={4}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="block mb-2">{t('uploadImage')}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px] bg-gray-50">
                {imagePreview ? (
                  <div className="w-full">
                    <img
                      src={imagePreview}
                      alt={t('preview')}
                      className="mx-auto max-h-[250px] object-contain mb-4"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                    >
                      {t('removeImage')}
                    </Button>
                  </div>
                ) : (
                  <label className="w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-10">
                      <Upload size={40} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">{t('clickToUpload')}</p>
                      <p className="text-xs text-gray-400 mt-1">{t('imageFormats')}</p>
                    </div>
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isUploading}
              >
                {isUploading ? t('processing') : t('uploadArtwork')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadArtwork;
