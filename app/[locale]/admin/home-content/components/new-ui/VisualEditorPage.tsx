
"use client"

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { EditableSection } from './EditableSection';
import { AboutSectionEditor, FeaturesSectionEditor, StatsSectionEditor, FeaturedProductsSectionEditor, TrustedPartnersSectionEditor, CtaSectionEditor } from './section-editors';
import { HeroSectionPreview, AboutSectionPreview, FeaturesSectionPreview, StatsSectionPreview, FeaturedProductsSectionPreview, TrustedPartnersSectionPreview, CtaSectionPreview } from './section-previews';
import { HeroBannerManager } from './HeroBannerManager';
import { FooterEditor } from './footer-editor';
import { FooterPreview } from './footer-preview';
import { useHomeContent } from '@/app/[locale]/contexts/HomeContentContext';

const sectionComponentMap: { [key: string]: { editor: React.FC<any>, preview: React.FC<any> } } = {
  about: { editor: AboutSectionEditor, preview: AboutSectionPreview },
  features: { editor: FeaturesSectionEditor, preview: FeaturesSectionPreview },
  stats: { editor: StatsSectionEditor, preview: StatsSectionPreview },
  featured_products: { editor: FeaturedProductsSectionEditor, preview: FeaturedProductsSectionPreview },
  trusted_partners: { editor: TrustedPartnersSectionEditor, preview: TrustedPartnersSectionPreview },
  cta: { editor: CtaSectionEditor, preview: CtaSectionPreview },
};

export default function VisualEditorPage() {
  const { 
    sections, 
    footerContent, 
    isLoading, 
    isAddingPartnerLogo,
    isDeletingPartnerLogo,
    fetchData, 
    updateBlock, 
    updateFooterItem, 
    addPartnerLogo, 
    deletePartnerLogo 
  } = useHomeContent();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // All handlers are now provided by the context

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
          {/* Hero Section - Managed via Banners */}
          <EditableSection
            title="Hero Section (Banners)"
            onSave={async () => { /* Handled in HeroBannerManager */ }}
            preview={<HeroSectionPreview blocks={[]} />}
          >
            <HeroBannerManager />
          </EditableSection>

          {sections.filter(section => section.section_key !== 'hero').map((section) => {
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
                <EditorComponent 
                  blocks={section.content_blocks} 
                  onUpdate={updateBlock} 
                  onAddPartnerLogo={section.section_key === 'trusted_partners' ? () => addPartnerLogo(section.id) : undefined}
                  onDeletePartnerLogo={section.section_key === 'trusted_partners' ? deletePartnerLogo : undefined}
                  isAddingPartnerLogo={section.section_key === 'trusted_partners' ? isAddingPartnerLogo : undefined}
                  isDeletingPartnerLogo={section.section_key === 'trusted_partners' ? isDeletingPartnerLogo : undefined}
                />
              </EditableSection>
            );
          })}

          <EditableSection
            title="Footer"
            onSave={async () => { /* Individual saves are handled in the editor components */ }}
            preview={<FooterPreview content={footerContent} />}
          >
            <FooterEditor content={footerContent} onUpdate={updateFooterItem} />
          </EditableSection>
        </main>
      </div>
  );
}
