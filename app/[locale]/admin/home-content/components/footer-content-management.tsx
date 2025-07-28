'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Pencil, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type FooterContent, updateFooterContent, updateFooterContentTranslation } from '@/lib/api';

interface FooterContentItemProps {
  item: FooterContent;
  locale: string;
  isTranslating: boolean;
  onTranslate: (id: number) => void;
  onUpdate: (item: FooterContent) => void;
}

function FooterContentItem({
  item,
  locale,
  isTranslating,
  onTranslate,
  onUpdate
}: FooterContentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(JSON.stringify(item.content, null, 2));
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const parsedContent = JSON.parse(editValue);

      if (locale === 'en') {
        // Update original content
        const updatedItem = await updateFooterContent(item.id, { content: parsedContent });
        if (updatedItem) {
          onUpdate(updatedItem);
        }
      } else {
        // Update translation
        await updateFooterContentTranslation(item.id, locale, parsedContent);
        onUpdate({ ...item, content: parsedContent });
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Footer content updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format or save failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline">{item.content_type}</Badge>
          <span className="font-medium">{item.content_key}</span>
        </div>
        {isEditing ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="font-mono text-sm"
            rows={3}
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            {JSON.stringify(item.content)}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTranslate(item.id)}
              disabled={isTranslating}
              title="Translate this footer content"
            >
              <Languages className="h-4 w-4 text-purple-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

interface FooterContentManagementProps {
  footerContent: FooterContent[];
  locale: string;
  isTranslating: boolean;
  onTranslate: (id: number) => void;
  onUpdate: (updatedItem: FooterContent) => void;
}

export default function FooterContentManagement({
  footerContent,
  locale,
  isTranslating,
  onTranslate,
  onUpdate
}: FooterContentManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Content</CardTitle>
        <CardDescription>Manage footer links, contact information, and social media</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {footerContent.map((item) => (
            <FooterContentItem
              key={item.id}
              item={item}
              locale={locale}
              isTranslating={isTranslating}
              onTranslate={onTranslate}
              onUpdate={onUpdate}
            />
          ))}
          {footerContent.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No footer content available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 