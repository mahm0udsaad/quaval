
"use client"

import { useState, useEffect } from 'react';
import { getHomeSections, getHomeContentBlocks, getFooterContent, HomeSection, HomeContentBlock, FooterContent, updateHomeContentBlock, updateFooterContent } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Eye, Save } from 'lucide-react';
import { EditableSection } from './EditableSection';
import { HeroSectionEditor, AboutSectionEditor, FeaturesSectionEditor, StatsSectionEditor, FeaturedProductsSectionEditor, TrustedPartnersSectionEditor, CtaSectionEditor } from './section-editors';
import { HeroSectionPreview, AboutSectionPreview, FeaturesSectionPreview, StatsSectionPreview, FeaturedProductsSectionPreview, TrustedPartnersSectionPreview, CtaSectionPreview } from './section-previews';
import { FooterEditor } from './footer-editor';
import { FooterPreview } from './footer-preview';
import { useToast } from '@/hooks/use-toast';

const sectionComponentMap: { [key: string]: { editor: React.FC<any>, preview: React.FC<any> } } = {
  hero: { editor: HeroSectionEditor, preview: HeroSectionPreview },
  about: { editor: AboutSectionEditor, preview: AboutSectionPreview },
  features: { editor: FeaturesSectionEditor, preview: FeaturesSectionPreview },
  stats: { editor: StatsSectionEditor, preview: StatsSectionPreview },
  featured_products: { editor: FeaturedProductsSectionEditor, preview: FeaturedProductsSectionPreview },
  trusted_partners: { editor: TrustedPartnersSectionEditor, preview: TrustedPartnersSectionPreview },
  cta: { editor: CtaSectionEditor, preview: CtaSectionPreview },
};

export default function VisualEditorPage() {
  const [sections, setSections] = useState<(HomeSection & { content_blocks: HomeContentBlock[] })[]>([]);
  const [footerContent, setFooterContent] = useState<FooterContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [sectionsData, blocksData, footerData] = await Promise.all([
        getHomeSections(),
        getHomeContentBlocks('en'),
        getFooterContent('en'),
      ]);

      const sectionsWithContent = sectionsData.map(section => ({
        ...section,
        content_blocks: blocksData.filter(block => block.section_id === section.id),
      }));

      setSections(sectionsWithContent);
      setFooterContent(footerData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ title: "Error fetching data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBlock = async (block: HomeContentBlock) => {
    try {
      const updatedBlock = await updateHomeContentBlock(block.id, { content: block.content });
      if (updatedBlock) {
        const newSections = sections.map(s => ({
          ...s,
          content_blocks: s.content_blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b),
        }));
        setSections(newSections);
        toast({ title: "Content updated!" });
      }
    } catch (error) {
      console.error("Error updating block:", error);
      toast({ title: "Error updating content", variant: "destructive" });
    }
  };

  const handleUpdateFooterContent = async (item: FooterContent) => {
    try {
        const updatedItem = await updateFooterContent(item.id, { content: item.content });
        if (updatedItem) {
            setFooterContent(footerContent.map(c => c.id === updatedItem.id ? updatedItem : c));
            toast({ title: "Footer content updated!" });
        }
    } catch (error) {
        console.error("Error updating footer content:", error);
        toast({ title: "Error updating footer content", variant: "destructive" });
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold">Edit Homepage</h1>
          <div>
            <Button variant="outline" className="mr-2">
              <Eye className="mr-2 h-4 w-4" />
              Preview Site
            </Button>
          </div>
        </header>
        <main className="p-8">
          {sections.map((section) => {
            const components = sectionComponentMap[section.section_key];
            if (!components) return <p key={section.id}>No editor for {section.section_name}.</p>;
            
            const EditorComponent = components.editor;
            const PreviewComponent = components.preview;

            return (
              <EditableSection
                key={section.id}
                title={section.section_name}
                onSave={async () => { /* Individual saves are handled in the editor components */ }}
                preview={<PreviewComponent blocks={section.content_blocks} />}
              >
                <EditorComponent blocks={section.content_blocks} onUpdate={handleUpdateBlock} />
              </EditableSection>
            );
          })}

          <EditableSection
            title="Footer"
            onSave={async () => { /* Individual saves are handled in the editor components */ }}
            preview={<FooterPreview content={footerContent} />}
          >
            <FooterEditor content={footerContent} onUpdate={handleUpdateFooterContent} />
          </EditableSection>
        </main>
      </div>
  );
}
