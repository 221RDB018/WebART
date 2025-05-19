import { Artwork, Frame } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

export const useArtworks = () => {
  const { t } = useLanguage();

  const artworks: Artwork[] = [
    {
      id: "1",
      title: t('abstractHarmony'),
      artist: "Elena Rivera",
      description: t('abstractHarmonyDesc'),
      price: 450,
      imageUrl: "/abstract-1.jpg",
      dimensions: {
        width: 70,
        height: 53,
      },
      category: "abstract"
    },
    {
      id: "2",
      title: t('sereneLandscape'),
      artist: "Michael Chen",
      description: t('sereneLandscapeDesc'),
      price: 680,
      imageUrl: "/landscape-1.jpg",
      dimensions: {
        width: 96,
        height: 64,
      },
      category: "landscape"
    },
    {
      id: "3",
      title: t('urbanPerspective'),
      artist: "James Wilson",
      description: t('urbanPerspectiveDesc'),
      price: 350,
      imageUrl: "/urban-1.jpg",
      dimensions: {
        width: 72,
        height: 48,
      },
      category: "photography"
    },
    {
      id: "4",
      title: t('etherealBloom'),
      artist: "Sofia Nakamura",
      description: t('etherealBloomDesc'),
      price: 520,
      imageUrl: "/floral-1.jpg",
      dimensions: {
        width: 65,
        height: 43,
      },
      category: "floral"
    },
    {
      id: "5",
      title: t('contemplation'),
      artist: "Marcus Johnson",
      description: t('contemplationDesc'),
      price: 790,
      imageUrl: "/portrait-1.jpg",
      dimensions: {
        width: 44,
        height: 66,
      },
      category: "portrait"
    },
    {
      id: "6",
      title: t('geometricDreams'),
      artist: "Leila Ahmed",
      description: t('geometricDreamsDesc'),
      price: 410,
      imageUrl: "/abstract-2.jpg",
      dimensions: {
        width: 86,
        height: 57,
      },
      category: "abstract"
    }
  ];

  const frames: Frame[] = [
    {
      id: "frame-1",
      name: t('classicBlack'),
      previewUrl: "/frames/black-frame.png",
      price: 85,
      color: "#000000",
      metalness: 0.1,
      roughness: 0.75,
      envMapIntensity: 1.0
    },
    {
      id: "frame-2",
      name: t('modernWhite'),
      previewUrl: "/frames/white-frame.png",
      price: 75,
      color: "#FFFFFF",
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0
    },
    {
      id: "frame-3",
      name: t('naturalWood'),
      previewUrl: "/frames/wood-frame.png",
      price: 95,
      color: "#C19A6B",
      metalness: 0.1,
      roughness: 0.75,
      envMapIntensity: 1.0
    },
    {
      id: "frame-4",
      name: t('goldFinish'),
      previewUrl: "/frames/gold-frame.png",
      price: 120,
      color: "#D4AF37",
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0
    },
    {
      id: "frame-5",
      name: t('silverMetal'),
      previewUrl: "/frames/silver-frame.png",
      price: 110,
      color: "#C0C0C0",
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0
    }
  ];

  const getArtworkById = (id: string): Artwork | undefined => {
    return artworks.find(artwork => artwork.id.toString() === id.toString());
  };

  const getFrameById = (id: string): Frame | undefined => {
    return frames.find(frame => frame.id.toString() === id.toString());
  };

  return {
    artworks,
    frames,
    getArtworkById,
    getFrameById
  };
};
