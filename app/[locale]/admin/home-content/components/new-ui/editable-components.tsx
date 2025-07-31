
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
}

export function EditableText({ initialValue, onSave }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button onClick={handleSave}>Save</Button>
        <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span>{value}</span>
      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => setIsEditing(true)}>
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function EditableMultilineText({ initialValue, onSave }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          rows={10}
          className="min-h-[200px]"
        />
        <div className="flex gap-2">
          <Button onClick={handleSave}>Save</Button>
          <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      <div className="whitespace-pre-wrap text-sm text-gray-600 mb-2">{value}</div>
      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => setIsEditing(true)}>
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  );
}


import { ImageUploadModal } from './ImageUploadModal';

// ... (EditableText, IconSelector, ColorPicker components remain the same)

export function EditableImage({ initialValue, onSave }: { initialValue: string; onSave: (newValue: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadComplete = (newUrl: string) => {
    onSave(newUrl);
    setIsModalOpen(false);
  };

  return (
    <div className="relative group">
      <img src={initialValue} alt="Editable" className="w-full h-auto rounded-md" />
      <Button variant="outline" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => setIsModalOpen(true)}>
        <Upload className="h-4 w-4" />
      </Button>
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
