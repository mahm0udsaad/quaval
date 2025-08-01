
"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit2, Upload, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { availableIcons } from './icon-list';

interface EditableTextProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function EditableText({ initialValue, onSave, label, placeholder, className }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`space-y-2 p-3 border-2 border-blue-200 rounded-lg bg-blue-50 ${className || ''}`}>
        {label && <label className="text-sm font-medium text-blue-800">{label}</label>}
        <div className="space-y-2">
          <Input 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
            placeholder={placeholder}
            className="bg-white border-blue-300 focus:border-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              size="sm"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              size="sm"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative p-2 rounded-md hover:bg-gray-50 transition-colors ${className || ''}`}>
      {label && <div className="text-xs text-gray-500 mb-1">{label}</div>}
      <div className="flex items-center justify-between">
        <span className="flex-1 text-sm">{value || <span className="text-gray-400 italic">Click to edit</span>}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-60 group-hover:opacity-100 ml-2 flex-shrink-0" 
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export function EditableMultilineText({ initialValue, onSave, label, placeholder, className }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`space-y-2 p-3 border-2 border-blue-200 rounded-lg bg-blue-50 ${className || ''}`}>
        {label && <label className="text-sm font-medium text-blue-800">{label}</label>}
        <div className="space-y-2">
          <Textarea 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
            rows={8}
            placeholder={placeholder}
            className="min-h-[200px] bg-white border-blue-300 focus:border-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              size="sm"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              size="sm"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative p-3 rounded-md hover:bg-gray-50 transition-colors border ${className || ''}`}>
      {label && <div className="text-xs text-gray-500 mb-2">{label}</div>}
      <div className="relative">
        <div className="whitespace-pre-wrap text-sm text-gray-700 min-h-[60px] pr-8">
          {value || <span className="text-gray-400 italic">Click to edit</span>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-0 right-0 h-6 w-6 opacity-60 group-hover:opacity-100" 
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}


import { ImageUploadModal } from './ImageUploadModal';

// ... (EditableText, IconSelector, ColorPicker components remain the same)

export function EditableImage({ initialValue, onSave, className, label }: { initialValue: string; onSave: (newValue: string) => void; className?: string; label?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = (newUrl: string) => {
    onSave(newUrl);
    setIsModalOpen(false);
    setImageError(false);
    setIsUploading(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    setIsModalOpen(true);
  };

  return (
    <div className={`relative group border rounded-lg p-3 hover:bg-gray-50 transition-colors ${className || ''}`}>
      {label && <div className="text-xs text-gray-500 mb-2">{label}</div>}
      <div className="relative">
        {imageError ? (
          <div className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer" onClick={handleUploadStart}>
            <div className="text-center text-gray-500">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Image not found</p>
              <p className="text-xs">Click to upload new image</p>
            </div>
          </div>
        ) : (
          <img 
            src={initialValue} 
            alt={label || "Editable image"} 
            className="w-full h-auto rounded-md object-cover max-h-48" 
            onError={handleImageError}
          />
        )}
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-2 right-2 opacity-60 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm" 
          onClick={handleUploadStart}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsUploading(false);
        }}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}


export function IconSelector({ initialValue, onSave }: { initialValue: string; onSave: (newValue: string) => void }) {
  const [selectedIcon, setSelectedIcon] = useState(initialValue);

  return (
    <div className="grid grid-cols-8 gap-2">
      {availableIcons.map(icon => (
        <Button
          key={icon.name}
          variant={selectedIcon === icon.name ? 'default' : 'outline'}
          size="icon"
          onClick={() => {
            setSelectedIcon(icon.name);
            onSave(icon.name);
          }}
        >
          <icon.component className="h-5 w-5" />
        </Button>
      ))}
    </div>
  );
}

export function ColorPicker({ initialValue, onSave, colorPalette }: { initialValue: string; onSave: (newValue: string) => void; colorPalette: string[] }) {
    const [selectedColor, setSelectedColor] = useState(initialValue);
  
    return (
      <div className="flex gap-2">
        {colorPalette.map(color => (
          <div
            key={color}
            className={`w-8 h-8 rounded-full cursor-pointer ${color}`}
            style={{ backgroundColor: color }}
            onClick={() => {
              setSelectedColor(color);
              onSave(color);
            }}
          >
            {selectedColor === color && <Check className="text-white w-full h-full p-1" />}
          </div>
        ))}
      </div>
    );
  }
