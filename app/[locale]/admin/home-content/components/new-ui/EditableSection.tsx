
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';

interface EditableSectionProps {
  title: string;
  children: React.ReactNode; // The editor component
  preview: React.ReactNode; // The preview component
  onSave: () => void;
}

export function EditableSection({ title, children, preview, onSave }: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the parent component
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}><X className="mr-2 h-4 w-4" /> Cancel</Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
          )}
        </div>
      </div>
      <div>
        {isEditing ? children : preview}
      </div>
    </div>
  );
}
