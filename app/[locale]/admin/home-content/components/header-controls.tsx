'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCcw, Globe, Languages, Sparkles, Monitor } from 'lucide-react';

const AVAILABLE_LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }
];

interface HeaderControlsProps {
  selectedLocale: string;
  showPreview: boolean;
  isLoading: boolean;
  isTranslating: boolean;
  onLocaleChange: (locale: string) => void;
  onTogglePreview: () => void;
  onRefresh: () => void;
  onTranslateAll: () => void;
}

export default function HeaderControls({
  selectedLocale,
  showPreview,
  isLoading,
  isTranslating,
  onLocaleChange,
  onTogglePreview,
  onRefresh,
  onTranslateAll
}: HeaderControlsProps) {
  return (
    <div className="bg-white border-b sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Home Page Content Management</h1>
            <p className="text-muted-foreground">Manage all home page content with live preview</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onTogglePreview}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Select value={selectedLocale} onValueChange={onLocaleChange}>
              <SelectTrigger className="w-40">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_LOCALES.map((locale) => (
                  <SelectItem key={locale.code} value={locale.code}>
                    {locale.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
              <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button 
              onClick={onTranslateAll} 
              disabled={isTranslating || isLoading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Sparkles className={`w-4 h-4 mr-2 ${isTranslating ? "animate-spin" : ""}`} />
              {isTranslating ? 'Translating...' : 'AI Translate All'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 