
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { artworks } from "../data/artworks";

const UploadArtwork = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImagePreview(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile || !title || !artist || !description || price <= 0) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields and upload an image.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // In a real application, you'd upload the file to a server
    // For this demo, we'll create a temporary URL and add to local data
    
    // Generate a unique ID for the new artwork
    const newId = uuidv4();
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Create new artwork object
    const newArtwork = {
      id: newId,
      title,
      artist,
      description,
      price,
      imageUrl,
      dimensions: {
        // Convert cm to inches for internal storage
        width: dimensions.width / 2.54,
        height: dimensions.height / 2.54
      },
      category: "custom"
    };
    
    // Add to artworks array (in real app, would be an API call)
    artworks.unshift(newArtwork);
    
    toast({
      title: "Artwork uploaded successfully!",
      description: "Your artwork has been added to the gallery.",
    });
    
    // Navigate to the new artwork's detail page
    setTimeout(() => {
      setIsUploading(false);
      navigate(`/artwork/${newId}`);
    }, 1000);
  };

  return (
    <div className="py-8 md:py-12">
      <div className="art-container max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-6 text-center">Upload Your Artwork</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Artwork Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter artwork title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="artist">Artist Name</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price.toString()}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Enter price"
                  min="1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width (cm)</Label>
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
                  <Label htmlFor="height">Height (cm)</Label>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter artwork description"
                  rows={4}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="block mb-2">Upload Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px] bg-gray-50">
                {imagePreview ? (
                  <div className="w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
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
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <label className="w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-10">
                      <Upload size={40} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 10MB)</p>
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
                {isUploading ? "Processing..." : "Upload Artwork"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadArtwork;
