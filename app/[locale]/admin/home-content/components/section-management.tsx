'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Languages, EyeOff } from 'lucide-react';
import { type HomeSection, type HomeContentBlock } from '@/lib/api';

interface SectionManagementProps {
  sections: HomeSection[];
  contentBlocks: HomeContentBlock[];
  isTranslating: boolean;
  onSectionToggle: (sectionId: number, enabled: boolean) => void;
  onBlockToggle: (blockId: number, enabled: boolean) => void;
  onDeleteBlock: (blockId: number) => void;
  onTranslateSingle: (contentId: number, contentType: 'home' | 'footer') => void;
  onEditBlock: (block: HomeContentBlock | null) => void;
  onAddContent: () => void;
}

export default function SectionManagement({
  sections,
  contentBlocks,
  isTranslating,
  onSectionToggle,
  onBlockToggle,
  onDeleteBlock,
  onTranslateSingle,
  onEditBlock,
  onAddContent
}: SectionManagementProps) {
  const getContentBlocksBySection = (sectionId: number) => {
    return contentBlocks.filter(block => block.section_id === sectionId);
  };

  const renderContentPreview = (block: HomeContentBlock) => {
    switch (block.block_type) {
      case 'text':
        return block.content.text;
      case 'image':
        return block.content.alt;
      case 'button':
        return `${block.content.text} → ${block.content.link}`;
      case 'stat':
        return `${block.content.value} - ${block.content.label}`;
      case 'feature':
        return `${block.content.title}: ${block.content.description}`;
      case 'icon':
        return `Icon: ${block.content.icon}`;
      default:
        return 'Content block';
    }
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {section.section_name}
                  <Badge variant={section.is_enabled ? "default" : "secondary"}>
                    {section.is_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </CardTitle>
                <CardDescription>Section: {section.section_key}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={section.is_enabled}
                  onCheckedChange={(checked) => onSectionToggle(section.id, checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddContent}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {getContentBlocksBySection(section.id).map((block) => (
                <div key={block.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{block.block_type}</Badge>
                      <span className="font-medium">{block.block_key}</span>
                      {!block.is_enabled && <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {renderContentPreview(block)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={block.is_enabled}
                      onCheckedChange={(checked) => onBlockToggle(block.id, checked)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTranslateSingle(block.id, 'home')}
                      disabled={isTranslating}
                      title="Translate this content to other languages"
                    >
                      <Languages className="h-4 w-4 text-purple-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditBlock(block)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteBlock(block.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {getContentBlocksBySection(section.id).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No content blocks in this section</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddContent}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Content Block
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 