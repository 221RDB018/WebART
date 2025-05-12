
import { Artwork, Frame } from "../types";

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Abstract Harmony",
    artist: "Elena Rivera",
    description: "A vibrant explosion of colors that evoke feelings of joy and harmony. Created using acrylic on canvas with a focus on expressive brushwork.",
    price: 450,
    imageUrl: "/abstract-1.jpg",
    dimensions: {
      width: 24,
      height: 36,
    },
    category: "abstract"
  },
  {
    id: "2",
    title: "Serene Landscape",
    artist: "Michael Chen",
    description: "A peaceful landscape capturing the tranquility of a mountain lake at dawn. Oil on canvas with meticulous attention to light and shadow.",
    price: 680,
    imageUrl: "/landscape-1.jpg",
    dimensions: {
      width: 30,
      height: 20,
    },
    category: "landscape"
  },
  {
    id: "3",
    title: "Urban Perspective",
    artist: "James Wilson",
    description: "A striking black and white photograph capturing the geometric patterns of modern architecture in the heart of the city.",
    price: 350,
    imageUrl: "/urban-1.jpg",
    dimensions: {
      width: 18,
      height: 24,
    },
    category: "photography"
  },
  {
    id: "4",
    title: "Ethereal Bloom",
    artist: "Sofia Nakamura",
    description: "A delicate watercolor painting of flowers that seem to float between reality and dreams, with soft colors and flowing forms.",
    price: 520,
    imageUrl: "/floral-1.jpg",
    dimensions: {
      width: 16,
      height: 20,
    },
    category: "floral"
  },
  {
    id: "5",
    title: "Contemplation",
    artist: "Marcus Johnson",
    description: "A powerful portrait that captures a moment of deep thought, with expressive brushwork that reveals the subject's inner world.",
    price: 790,
    imageUrl: "/portrait-1.jpg",
    dimensions: {
      width: 24,
      height: 30,
    },
    category: "portrait"
  },
  {
    id: "6",
    title: "Geometric Dreams",
    artist: "Leila Ahmed",
    description: "A modern abstract piece featuring bold geometric shapes and a carefully curated color palette that creates a sense of depth and movement.",
    price: 410,
    imageUrl: "/abstract-2.jpg",
    dimensions: {
      width: 24,
      height: 24,
    },
    category: "abstract"
  }
];

export const frames: Frame[] = [
  {
    id: "frame-1",
    name: "Classic Black",
    previewUrl: "/frames/black-frame.png",
    price: 85,
    color: "#000000",
    metalness: 0.1,
    roughness: 0.75,
    envMapIntensity: 1.0
  },
  {
    id: "frame-2",
    name: "Modern White",
    previewUrl: "/frames/white-frame.png",
    price: 75,
    color: "#FFFFFF",
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.0
  },
  {
    id: "frame-3",
    name: "Natural Wood",
    previewUrl: "/frames/wood-frame.png",
    price: 95,
    color: "#C19A6B",
    metalness: 0.1,
    roughness: 0.75,
    envMapIntensity: 1.0
  },
  {
    id: "frame-4",
    name: "Gold Finish",
    previewUrl: "/frames/gold-frame.png",
    price: 120,
    color: "#D4AF37",
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.0
  },
  {
    id: "frame-5",
    name: "Silver Metal",
    previewUrl: "/frames/silver-frame.png",
    price: 110,
    color: "#C0C0C0",
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.0
  }
];

export const getArtworkById = (id: string): Artwork | undefined => {
  return artworks.find(artwork => artwork.id.toString() === id.toString());
};

export const getFrameById = (id: string): Frame | undefined => {
  return frames.find(frame => frame.id.toString() === id.toString());
};
