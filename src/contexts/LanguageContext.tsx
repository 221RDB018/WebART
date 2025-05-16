
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
