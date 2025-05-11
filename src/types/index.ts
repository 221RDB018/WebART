
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  imageUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
  category: string;
}

export interface Frame {
  id: string;
  name: string;
  previewUrl: string;
  price: number;
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
}

export interface CartItem {
  artwork: Artwork;
  frame?: Frame;
  customDimensions: {
    width: number;
    height: number;
  };
  quantity: number;
}
