export type Language = 'en' | 'es' | 'fr';

const LANGUAGE_STORAGE_KEY = 'preferredLanguage';
const DEFAULT_LANGUAGE: Language = 'en';

export const languageStorage = {
  /**
   * Get the saved language from localStorage
   */
  getLanguage(): Language {
    if (typeof window === 'undefined') {
      return DEFAULT_LANGUAGE;
    }
    
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      
      // Validate that the saved language is one of the supported languages
      if (savedLanguage && ['en', 'es', 'fr'].includes(savedLanguage)) {
        return savedLanguage;
      }
      
      return DEFAULT_LANGUAGE;
    } catch (error) {
      console.error('Error reading language from localStorage:', error);
      return DEFAULT_LANGUAGE;
    }
  },

  /**
   * Save the language to localStorage
   */
  setLanguage(language: Language): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      // Validate the language before saving
      if (!['en', 'es', 'fr'].includes(language)) {
        console.error(`Invalid language: ${language}`);
        return;
      }
      
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      console.log(`Language saved to localStorage: ${language}`);
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  },

  /**
   * Remove the saved language from localStorage
   */
  clearLanguage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      console.log('Language preference cleared from localStorage');
    } catch (error) {
      console.error('Error clearing language from localStorage:', error);
    }
  },

  /**
   * Check if a language is already saved
   */
  hasLanguage(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) !== null;
    } catch (error) {
      console.error('Error checking language in localStorage:', error);
      return false;
    }
  }
}; 