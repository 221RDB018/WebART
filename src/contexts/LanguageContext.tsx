import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define available languages
type Language = 'en' | 'lv';

// Translation data structure
interface Translations {
  [key: string]: {
    en: string;
    lv: string;
  };
}

// Create translation dictionary
const translations: Translations = {
  // Common
  back: {
    en: 'Back',
    lv: 'Atpakaļ',
  },
  // Navbar
  home: {
    en: 'Home',
    lv: 'Sākums',
  },
  gallery: {
    en: 'Gallery',
    lv: 'Galerija',
  },
  signIn: {
    en: 'Sign In',
    lv: 'Ieiet',
  },
  yourCart: {
    en: 'Your Cart',
    lv: 'Jūsu grozs',
  },
  reviewItems: {
    en: 'Review your selected items',
    lv: 'Pārskatiet izvēlētos priekšmetus',
  },
  // AR Preview
  webARExperience: {
    en: 'WebAR Experience',
    lv: 'WebAR Pieredze',
  },
  experienceDescription: {
    en: 'This feature will allow you to visualize "{title}" on your wall using augmented reality.',
    lv: 'Šī funkcija ļaus jums vizualizēt "{title}" uz jūsu sienas, izmantojot papildināto realitāti.',
  },
  frame: {
    en: 'Frame:',
    lv: 'Rāmis:',
  },
  frameWithName: {
    en: 'Frame ({name})',
    lv: 'Rāmis ({name})',
  },
  launchAR: {
    en: 'Launch WebAR Experience',
    lv: 'Sākt WebAR Pieredzi',
  },
  howItWorks: {
    en: 'How it works',
    lv: 'Kā tas darbojas',
  },
  pointCamera: {
    en: 'Point your camera at your wall',
    lv: 'Vērsiet kameru pret sienu',
  },
  detectSurface: {
    en: 'The app will detect the flat surface',
    lv: 'Lietotne noteiks plakano virsmu',
  },
  visualizeArtwork: {
    en: 'Visualize the artwork with your selected frame and size',
    lv: 'Vizualizējiet mākslas darbu ar izvēlēto rāmi un izmēru',
  },
  adjustPosition: {
    en: 'Adjust the position by dragging on your screen',
    lv: 'Pielāgojiet pozīciju, velkot pa ekrānu',
  },
  videoTutorial: {
    en: 'Video Tutorial',
    lv: 'Video Pamācība',
  },
  watchTutorial: {
    en: 'Watch our quick tutorial to learn how to get the most out of the WebAR experience and place artwork perfectly in your space.',
    lv: 'Noskatieties mūsu īso pamācību, lai uzzinātu, kā pilnvērtīgi izmantot WebAR pieredzi un ideāli novietot mākslas darbu savā telpā.',
  },
  backToDetails: {
    en: 'Back to Artwork Details',
    lv: 'Atpakaļ uz Mākslas Darba Informāciju',
  },
  by: {
    en: 'by',
    lv: 'autors',
  },
  artworkNotFound: {
    en: 'Artwork not found.',
    lv: 'Mākslas darbs nav atrasts.',
  },
  returnToGallery: {
    en: 'Return to Gallery',
    lv: 'Atgriezties Galerijā',
  },
  description: {
    en: 'Description',
    lv: 'Apraksts',
  },
  selectFrame: {
    en: 'Select Frame',
    lv: 'Izvēlieties Rāmi',
  },
  noFrame: {
    en: 'No Frame',
    lv: 'Bez Rāmja',
  },
  customizeSize: {
    en: 'Customize Size',
    lv: 'Pielāgot Izmēru',
  },
  dimensions: {
    en: 'Size: {width} × {height} cm',
    lv: 'Izmērs: {width} × {height} cm',
  },
  original: {
    en: 'Original: {width} × {height} cm',
    lv: 'Oriģināls: {width} × {height} cm',
  },
  artwork: {
    en: 'Artwork ({width} × {height} cm)',
    lv: 'Mākslas darbs ({width} × {height} cm)',
  },
  total: {
    en: 'Total',
    lv: 'Kopā',
  },
  addToCart: {
    en: 'Add to Cart',
    lv: 'Pievienot Grozam',
  },
  arPreview: {
    en: 'AR Preview',
    lv: 'AR Pārskats',
  },
  error: {
    en: 'Error',
    lv: 'Kļūda',
  },
  loading: {
    en: 'Loading...',
    lv: 'Ielādē...',
  },
  save: {
    en: 'Save',
    lv: 'Saglabāt',
  },
  cancel: {
    en: 'Cancel',
    lv: 'Atcelt',
  },
  delete: {
    en: 'Delete',
    lv: 'Dzēst',
  },
  edit: {
    en: 'Edit',
    lv: 'Rediģēt',
  },
  search: {
    en: 'Search',
    lv: 'Meklēt',
  },
  filter: {
    en: 'Filter',
    lv: 'Filtrēt',
  },
  sort: {
    en: 'Sort',
    lv: 'Kārtot',
  },
  price: {
    en: 'Price',
    lv: 'Cena',
  },
  color: {
    en: 'Color',
    lv: 'Krāsa',
  },
  style: {
    en: 'Style',
    lv: 'Stils',
  },
  artist: {
    en: 'Artist',
    lv: 'Mākslinieks',
  },
  category: {
    en: 'Category',
    lv: 'Kategorija',
  },
  date: {
    en: 'Date',
    lv: 'Datums',
  },
  status: {
    en: 'Status',
    lv: 'Statuss',
  },
  quantity: {
    en: 'Quantity',
    lv: 'Daudzums',
  },
  subtotal: {
    en: 'Subtotal',
    lv: 'Starpsumma',
  },
  shipping: {
    en: 'Shipping',
    lv: 'Piegāde',
  },
  tax: {
    en: 'Tax',
    lv: 'Nodoklis',
  },
  discount: {
    en: 'Discount',
    lv: 'Atlaide',
  },
  checkout: {
    en: 'Checkout',
    lv: 'Kasi',
  },
  continueShopping: {
    en: 'Continue Shopping',
    lv: 'Turpināt Iepirkties',
  },
  emptyCart: {
    en: 'Your cart is empty',
    lv: 'Jūsu grozs ir tukšs',
  },
  viewCart: {
    en: 'View Cart',
    lv: 'Skatīt Grozu',
  },
  clearCart: {
    en: 'Clear Cart',
    lv: 'Iztīrīt Grozu',
  },
  removeItem: {
    en: 'Remove Item',
    lv: 'Noņemt Preci',
  },
  updateQuantity: {
    en: 'Update Quantity',
    lv: 'Atjaunināt Daudzumu',
  },
  applyCoupon: {
    en: 'Apply Coupon',
    lv: 'Izmantot Kupona',
  },
  enterCoupon: {
    en: 'Enter coupon code',
    lv: 'Ievadiet kupona kodu',
  },
  invalidCoupon: {
    en: 'Invalid coupon code',
    lv: 'Nederīgs kupona kods',
  },
  couponApplied: {
    en: 'Coupon applied successfully',
    lv: 'Kupons veiksmīgi piemērots',
  },
  // Index page translations
  findArtThatSpeaks: {
    en: 'Find Art That Speaks To You',
    lv: 'Atrodiet Mākslu, Kas Runā Ar Jums',
  },
  discoverUniqueArtworks: {
    en: 'Discover unique artworks from talented artists and customize them to perfectly fit your space.',
    lv: 'Iepazīstieties ar unikāliem mākslas darbiem no talantīgiem māksliniekiem un pielāgojiet tos, lai tie ideāli iederētos jūsu telpā.',
  },
  exploreGallery: {
    en: 'Explore Gallery',
    lv: 'Izpētīt Galeriju',
  },
  howItWorksTitle: {
    en: 'How It Works',
    lv: 'Kā Tas Darbojas',
  },
  platformDescription: {
    en: 'Our platform makes it easy to find the perfect artwork for your space and customize it to your exact specifications.',
    lv: 'Mūsu platforma ļauj viegli atrast perfektu mākslas darbu jūsu telpai un pielāgot to pēc jūsu precīzām specifikācijām.',
  },
  browseArtwork: {
    en: 'Browse Artwork',
    lv: 'Pārlūkot Mākslas Darbus',
  },
  browseDescription: {
    en: 'Explore our curated collection of artwork from talented artists around the world.',
    lv: 'Izpētiet mūsu izvēlēto mākslas darbu kolekciju no talantīgiem māksliniekiem visā pasaulē.',
  },
  customize: {
    en: 'Customize',
    lv: 'Pielāgot',
  },
  customizeDescription: {
    en: 'Select your preferred frame style and customize dimensions to fit your space perfectly.',
    lv: 'Izvēlieties vēlamo rāmja stilu un pielāgojiet izmērus, lai tie ideāli iederētos jūsu telpā.',
  },
  visualize: {
    en: 'Visualize',
    lv: 'Vizualizēt',
  },
  visualizeDescription: {
    en: 'Preview how the artwork will look in your space with our WebAR technology.',
    lv: 'Priekšskatiet, kā mākslas darbs izskatīsies jūsu telpā, izmantojot mūsu WebAR tehnoloģiju.',
  },
  featuredArtwork: {
    en: 'Featured Artwork',
    lv: 'Ievērības Cienīgs Mākslas Darbs',
  },
  viewAll: {
    en: 'View all',
    lv: 'Skatīt visu',
  },
  readyToTransform: {
    en: 'Ready to Transform Your Space?',
    lv: 'Gatavi Pārveidot Savu Telpu?',
  },
  exploreCollection: {
    en: 'Explore our curated collection of artwork and find the perfect piece for your home or office.',
    lv: 'Izpētiet mūsu izvēlēto mākslas darbu kolekciju un atrodiet perfektu gabalu savam mājoklim vai birojam.',
  },
  browseGallery: {
    en: 'Browse Gallery',
    lv: 'Pārlūkot Galeriju',
  },
  // Gallery page translations
  artGallery: {
    en: 'Art Gallery',
    lv: 'Mākslas Galerija',
  },
  galleryDescription: {
    en: 'Explore our curated collection of unique artworks from talented artists around the world.',
    lv: 'Izpētiet mūsu izvēlēto unikālo mākslas darbu kolekciju no talantīgiem māksliniekiem visā pasaulē.',
  },
  uploadYourArtwork: {
    en: 'Upload Your Artwork',
    lv: 'Augšupielādēt Savu Mākslas Darbu',
  },
  allArtworks: {
    en: 'All Artworks',
    lv: 'Visi Mākslas Darbi',
  },
  abstract: {
    en: 'Abstract',
    lv: 'Abstrakts',
  },
  landscape: {
    en: 'Landscape',
    lv: 'Krajums',
  },
  portrait: {
    en: 'Portrait',
    lv: 'Portrets',
  },
  photography: {
    en: 'Photography',
    lv: 'Fotogrāfija',
  },
  floral: {
    en: 'Floral',
    lv: 'Ziedu',
  },
  myUploads: {
    en: 'My Uploads',
    lv: 'Mani Augšupielādes',
  },
  noArtworksFound: {
    en: 'No artworks found in this category.',
    lv: 'Šajā kategorijā nav atrasts neviens mākslas darbs.',
  },
  uploadFirstArtwork: {
    en: 'Upload Your First Artwork',
    lv: 'Augšupielādēt Savu Pirmo Mākslas Darbu',
  },
  // ArtworkDetail page translations
  artworkWithDimensions: {
    en: 'Artwork ({width} × {height} cm)',
    lv: 'Mākslas darbs ({width} × {height} cm)',
  },
  // Footer translations
  footerDescription: {
    en: 'Discover unique art pieces from talented artists around the world and customize them to perfectly fit your space.',
    lv: 'Iepazīstieties ar unikāliem mākslas darbiem no talantīgiem māksliniekiem visā pasaulē un pielāgojiet tos, lai tie ideāli iederētos jūsu telpā.',
  },
  navigation: {
    en: 'Navigation',
    lv: 'Navigācija',
  },
  allRightsReserved: {
    en: '© {year} WebART. All rights reserved.',
    lv: '© {year} WebART. Visas tiesības aizsargātas.',
  },
  // Artwork translations
  abstractHarmony: {
    en: 'Abstract Harmony',
    lv: 'Abstrakta Harmonija',
  },
  abstractHarmonyDesc: {
    en: 'A vibrant explosion of colors that evoke feelings of joy and harmony. Created using acrylic on canvas with a focus on expressive brushwork.',
    lv: 'Krāsu sprādziens, kas izraisa prieka un harmonijas sajūtas. Izveidots, izmantojot akrilu uz audekla, ar uzsvaru uz ekspresīvu ota darbu.',
  },
  sereneLandscape: {
    en: 'Serene Landscape',
    lv: 'Mierīgs Krajums',
  },
  sereneLandscapeDesc: {
    en: 'A peaceful landscape capturing the tranquility of a mountain lake at dawn. Oil on canvas with meticulous attention to light and shadow.',
    lv: 'Mierīgs krajums, kas attēlo kalnu ezera mieru rītausmā. Eļļa uz audekla ar rūpīgu uzmanību gaismai un ēnām.',
  },
  urbanPerspective: {
    en: 'Urban Perspective',
    lv: 'Pilsētas Perspektīva',
  },
  urbanPerspectiveDesc: {
    en: 'A striking black and white photograph capturing the geometric patterns of modern architecture in the heart of the city.',
    lv: 'Iespaidīga melnbaltā fotogrāfija, kas attēlo mūsdienu arhitektūras ģeometriskos rakstus pilsētas sirdī.',
  },
  etherealBloom: {
    en: 'Ethereal Bloom',
    lv: 'Eteriska Ziedēšana',
  },
  etherealBloomDesc: {
    en: 'A delicate watercolor painting of flowers that seem to float between reality and dreams, with soft colors and flowing forms.',
    lv: 'Delikāta akvareļa glezna ar ziediem, kas šķiet peld starp realitāti un sapņiem, ar maigām krāsām un plūstošām formām.',
  },
  contemplation: {
    en: 'Contemplation',
    lv: 'Kontemplācija',
  },
  contemplationDesc: {
    en: 'A powerful portrait that captures a moment of deep thought, with expressive brushwork that reveals the subject\'s inner world.',
    lv: 'Spēcīgs portrets, kas attēlo dziļas domāšanas brīdi, ar ekspresīvu ota darbu, kas atklāj objekta iekšējo pasauli.',
  },
  geometricDreams: {
    en: 'Geometric Dreams',
    lv: 'Ģeometriskie Sapņi',
  },
  geometricDreamsDesc: {
    en: 'A modern abstract piece featuring bold geometric shapes and a carefully curated color palette that creates a sense of depth and movement.',
    lv: 'Mūsdienu abstrakts darbs ar izteiksmīgām ģeometriskām formām un rūpīgi izvēlētu krāsu paleti, kas rada dziļuma un kustības sajūtu.',
  },
  // Frame translations
  classicBlack: {
    en: 'Classic Black',
    lv: 'Klasiskais Melnais',
  },
  modernWhite: {
    en: 'Modern White',
    lv: 'Mūsdienu Baltais',
  },
  naturalWood: {
    en: 'Natural Wood',
    lv: 'Dabīgais Koka',
  },
  goldFinish: {
    en: 'Gold Finish',
    lv: 'Zelta Apdare',
  },
  silverMetal: {
    en: 'Silver Metal',
    lv: 'Sudraba Metāls',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get language from localStorage if available, default to English
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    return storedLanguage ? storedLanguage : 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string, params?: Record<string, string>) => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    let translated = translations[key][language];
    
    // Replace parameters in the translated string if they exist
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translated = translated.replace(`{${paramKey}}`, paramValue);
      });
    }
    
    return translated;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
