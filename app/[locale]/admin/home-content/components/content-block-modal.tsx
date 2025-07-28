'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  type HomeSection,
  type HomeContentBlock,
  updateHomeContentBlock,
  createHomeContentBlock,
  updateHomeContentTranslation
} from '@/lib/api';

const BLOCK_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image' },
  { value: 'button', label: 'Button' },
  { value: 'stat', label: 'Statistic' },
  { value: 'feature', label: 'Feature' },
  { value: 'icon', label: 'Icon' }
];

const AVAILABLE_ICONS = [
  'Award', 'Clock', 'Shield', 'Globe', 'PenTool', 'Truck', 'CheckCircle', 'Play'
];

interface ContentBlockModalProps {
  block: HomeContentBlock | null;
  sections: HomeSection[];
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: HomeContentBlock) => void;
}

export default function ContentBlockModal({
  block,
  sections,
  locale,
  isOpen,
  onClose,
  onSave
}: ContentBlockModalProps) {
  const [formData, setFormData] = useState({
    section_id: block?.section_id || sections[0]?.id || 0,
    block_key: block?.block_key || '',
    block_type: block?.block_type || 'text',
    content: block?.content || {},
    sort_order: block?.sort_order || 0,
    is_enabled: block?.is_enabled ?? true
  });
  const { toast } = useToast();

  useEffect(() => {
    if (block) {
      setFormData({
        section_id: block.section_id,
        block_key: block.block_key,
        block_type: block.block_type,
        content: block.content,
        sort_order: block.sort_order,
        is_enabled: block.is_enabled
      });
    } else {
      setFormData({
        section_id: sections[0]?.id || 0,
        block_key: '',
        block_type: 'text',
        content: {},
        sort_order: 0,
        is_enabled: true
      });
    }
  }, [block, sections]);

  const handleSave = async () => {
    try {
      if (block) {
        // Update existing block
        if (locale === 'en') {
          const updatedBlock = await updateHomeContentBlock(block.id, formData);
          if (updatedBlock) onSave(updatedBlock);
        } else {
          // Update translation
          await updateHomeContentTranslation(block.id, locale, formData.content);
          onSave({ ...block, content: formData.content });
        }
      } else {
        // Create new block
        const newBlock = await createHomeContentBlock(formData);
        if (newBlock) onSave(newBlock);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content block",
        variant: "destructive",
      });
    }
  };

  const renderContentFields = () => {
    switch (formData.block_type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label>Text Content</Label>
              <Textarea
                value={formData.content.text || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, text: e.target.value }
                })}
                placeholder="Enter your text content..."
              />
            </div>
            <div>
              <Label>Tag (optional)</Label>
              <Input
                value={formData.content.tag || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, tag: e.target.value }
                })}
                placeholder="badge, heading, etc."
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={formData.content.url || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, url: e.target.value }
                })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={formData.content.alt || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, alt: e.target.value }
                })}
                placeholder="Describe the image"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label>Button Text</Label>
              <Input
                value={formData.content.text || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, text: e.target.value }
                })}
                placeholder="Click me"
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={formData.content.link || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, link: e.target.value }
                })}
                placeholder="/contact"
              />
            </div>
            <div>
              <Label>Variant</Label>
              <Select
                value={formData.content.variant || 'primary'}
                onValueChange={(value) => setFormData({
                  ...formData,
                  content: { ...formData.content, variant: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'stat':
        return (
          <div className="space-y-4">
            <div>
              <Label>Value</Label>
              <Input
                value={formData.content.value || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, value: e.target.value }
                })}
                placeholder="100+"
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input
                value={formData.content.label || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, label: e.target.value }
                })}
                placeholder="Happy Customers"
              />
            </div>
            <div>
              <Label>Color Gradient</Label>
              <Input
                value={formData.content.color || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, color: e.target.value }
                })}
                placeholder="from-blue-500 to-blue-600"
              />
            </div>
          </div>
        );

      case 'feature':
        return (
          <div className="space-y-4">
            <div>
              <Label>Icon</Label>
              <Select
                value={formData.content.icon || ''}
                onValueChange={(value) => setFormData({
                  ...formData,
                  content: { ...formData.content, icon: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ICONS.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={formData.content.title || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, title: e.target.value }
                })}
                placeholder="Feature Title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.content.description || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, description: e.target.value }
                })}
                placeholder="Feature description..."
              />
            </div>
          </div>
        );

      case 'icon':
        return (
          <div>
            <Label>Icon Name</Label>
            <Select
              value={formData.content.icon || ''}
              onValueChange={(value) => setFormData({
                ...formData,
                content: { ...formData.content, icon: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ICONS.map(icon => (
                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return (
          <div>
            <Label>Content (JSON)</Label>
            <Textarea
              value={JSON.stringify(formData.content, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setFormData({ ...formData, content: parsed });
                } catch (error) {
                  // Invalid JSON, keep the string for now
                }
              }}
              className="font-mono"
              rows={6}
              placeholder='{"key": "value"}'
            />
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {block ? 'Edit Content Block' : 'Add Content Block'}
            {locale !== 'en' && <Badge className="ml-2">{locale.toUpperCase()}</Badge>}
          </DialogTitle>
          <DialogDescription>
            {locale === 'en' ? 'Manage content block settings and content' : 'Edit translated content'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {locale === 'en' && (
            <>
              <div>
                <Label>Section</Label>
                <Select
                  value={formData.section_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, section_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(section => (
                      <SelectItem key={section.id} value={section.id.toString()}>
                        {section.section_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Block Key</Label>
                <Input
                  value={formData.block_key}
                  onChange={(e) => setFormData({ ...formData, block_key: e.target.value })}
                  placeholder="unique_block_key"
                />
              </div>

              <div>
                <Label>Block Type</Label>
                <Select
                  value={formData.block_type}
                  onValueChange={(value) => setFormData({ ...formData, block_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOCK_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </>
          )}

          {renderContentFields()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 