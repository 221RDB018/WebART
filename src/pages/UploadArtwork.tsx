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

// Функция для конвертации File в Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Функция для получения размеров изображения
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Конвертируем пиксели в сантиметры (примерно 96 DPI = 37.8 пикселей на сантиметр)
      const pixelsPerCm = 37.8;
      const width = Math.round(img.width / pixelsPerCm)*5;
      const height = Math.round(img.height / pixelsPerCm)*5;
      resolve({ width, height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const UploadArtwork: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { artworks, setArtworks } = useArtworks();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState({
    width: 40,  // Default width in cm
    height: 50  // Default height in cm
  });
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB в байтах

  // При загрузке компонента загружаем сохраненные работы
  useEffect(() => {
    const savedArtworks = localStorage.getItem('savedArtworks');
    if (savedArtworks) {
      const parsedArtworks = JSON.parse(savedArtworks);
      // Обновляем глобальный массив artworks
      artworks.length = 0; // Очищаем массив
      artworks.push(...parsedArtworks); // Добавляем сохраненные работы
    }

    const webarArtworks = localStorage.getItem('webarArtworks');
    if (!webarArtworks) {
      // Инициализируем хранилище начальными данными из artworks
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
      
      // Проверяем размер файла
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Kļūda",
          description: "Attēla izmērs nedrīkst pārsniegt 10MB",
          variant: "destructive"
        });
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImagePreview(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const { width, height } = await getImageDimensions(file);
        setDimensions({ width, height });
      } catch (error) {
        console.error('Error getting image dimensions:', error);
        toast({
          title: "Kļūda",
          description: "Neizdevās noteikt attēla izmērus. Lūdzu, iestatiet tos manuāli.",
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
        title: "Trūkst informācijas",
        description: "Lūdzu, aizpildiet visus laukus un augšupielādējiet attēlu.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
    const newId = uuidv4();
      const imageBase64 = await fileToBase64(imageFile);
    
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
    
      // Обновляем artworks с помощью setArtworks
      const updatedArtworks = [newArtwork, ...artworks];
      setArtworks(updatedArtworks);
      
      // Сохраняем в localStorage
      localStorage.setItem('savedArtworks', JSON.stringify(updatedArtworks));
      
      // Обновляем данные для WebAR
      updateWebARData(newArtwork);
    
    toast({
        title: "Mākslas darbs veiksmīgi augšupielādēts!",
        description: "Jūsu mākslas darbs ir pievienots galerijai un WebAR pieredzei.",
    });
    
    setTimeout(() => {
      setIsUploading(false);
      navigate(`/artwork/${newId}`);
    }, 1000);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Kļūda augšupielādējot mākslas darbu",
        description: "Radusies problēma, pievienojot jūsu mākslas darbu. Lūdzu, mēģiniet vēlreiz.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="py-8 md:py-12">
      <div className="art-container max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-6 text-center">Augšupielādēt mākslas darbu</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Mākslas darba nosaukums</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ievadiet mākslas darba nosaukumu"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="artist">Mākslinieka vārds</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Ievadiet mākslinieka vārdu"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">Cena</Label>
                <Input
                  id="price"
                  type="number"
                  value={price.toString()}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Ievadiet cenu"
                  min="1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Platums (cm)</Label>
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
                  <Label htmlFor="height">Augstums (cm)</Label>
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
                <Label htmlFor="description">Apraksts</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ievadiet mākslas darba aprakstu"
                  rows={4}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="block mb-2">Augšupielādēt attēlu</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px] bg-gray-50">
                {imagePreview ? (
                  <div className="w-full">
                    <img
                      src={imagePreview}
                      alt="Priekšskatījums"
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
                      Noņemt attēlu
                    </Button>
                  </div>
                ) : (
                  <label className="w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-10">
                      <Upload size={40} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Klikšķiniet, lai augšupielādētu vai velciet un nometiet</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (maks. 10MB)</p>
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
                {isUploading ? "Apstrādā..." : "Augšupielādēt mākslas darbu"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadArtwork;
