'use client';

import React from 'react';
import { Monitor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type HomeSection, type HomeContentBlock, type FooterContent } from '@/lib/api';

// Import existing section components
import {
  HeroSection,
  StatsSection,
  AboutSection,
  FeaturesSection,
  TrustedPartnersSection,
  CTASection
} from '@/app/[locale]/components/sections';

interface SectionPreviewProps {
  previewData: {
    sections: (HomeSection & { content_blocks: HomeContentBlock[] })[];
    footer: FooterContent[];
  };
  locale: string;
}

export default function SectionPreview({ previewData, locale }: SectionPreviewProps) {
  // Helper functions for preview
  const getSection = (sectionKey: string) => {
    return previewData.sections.find(section => section.section_key === sectionKey && section.is_enabled);
  };

  const getContentBlock = (sectionKey: string, blockKey: string) => {
    const section = getSection(sectionKey);
    return section?.content_blocks.find(block => block.block_key === blockKey && block.is_enabled);
  };

  const getContentBlocksByType = (sectionKey: string, blockType: string) => {
    const section = getSection(sectionKey);
    return section?.content_blocks.filter(block => block.block_type === blockType && block.is_enabled) || [];
  };

  const heroSection = getSection('hero');
  const statsSection = getSection('stats');
  const aboutSection = getSection('about');
  const featuresSection = getSection('features');
  const partnersSection = getSection('trusted_partners');
  const ctaSection = getSection('cta');

  if (previewData.sections.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No content to preview</p>
        <p className="text-sm mt-2">Add some content blocks to see the preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-0 bg-white rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
            <p className="text-sm text-gray-600">Changes reflect immediately</p>
          </div>
          <Badge variant="outline">{locale.toUpperCase()}</Badge>
        </div>
      </div>

      <div className="preview-content" style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%' }}>
        {/* Hero Section */}
        {heroSection && (
          <HeroSection />
        )}

        {/* Stats Section */}
        {statsSection && (
          <StatsSection
            section={statsSection}
            isVisible={true}
            statsRef={{ current: null }}
            getContentBlocksByType={getContentBlocksByType}
          />
        )}

        {/* About Section */}
        {aboutSection && (
          <AboutSection
            section={aboutSection}
            isVisible={true}
            aboutRef={{ current: null }}
            locale={locale}
            getContentBlock={getContentBlock}
          />
        )}

        {/* Features Section */}
        {featuresSection && (
          <FeaturesSection
            section={featuresSection}
            isVisible={true}
            featuresRef={{ current: null }}
            locale={locale}
            t={(key: string) => key} // Simple fallback for preview
            getContentBlock={getContentBlock}
            getContentBlocksByType={getContentBlocksByType}
          />
        )}

        {/* Trusted Partners Section */}
        {partnersSection && (
          <TrustedPartnersSection
            section={partnersSection}
            getContentBlock={getContentBlock}
            getContentBlocksByType={getContentBlocksByType}
          />
        )}

        {/* CTA Section */}
        {ctaSection && (
          <CTASection
            section={ctaSection}
            getContentBlock={getContentBlock}
            getContentBlocksByType={getContentBlocksByType}
          />
        )}
      </div>
    </div>
  );
} 