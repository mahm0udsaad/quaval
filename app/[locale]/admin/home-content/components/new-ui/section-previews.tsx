"use client"

import { HomeContentBlock } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { availableIcons } from './icon-list';

interface SectionPreviewProps {
  blocks: HomeContentBlock[];
}

const findBlock = (blocks: HomeContentBlock[], key: string) => blocks.find(b => b.block_key === key);

export function HeroSectionPreview({ blocks }: SectionPreviewProps) {
  // Hero section is now managed via banners, show a placeholder preview
  return (
    <div className="relative h-64 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
        <h1 className="text-4xl font-bold mb-2">Hero Section Preview</h1>
        <p className="text-xl text-blue-100">Managed via Banner Carousel</p>
        <p className="text-sm text-blue-200 mt-4">Use the "Manage Banners" button to edit hero content</p>
      </div>
    </div>
  );
}

export function AboutSectionPreview({ blocks }: SectionPreviewProps) {
    const heading = findBlock(blocks, 'about_heading');
    const title = findBlock(blocks, 'about_title');
    const image = findBlock(blocks, 'about_image');
    
    const highlight1Icon = findBlock(blocks, 'about_highlight_1_icon');
    const highlight1Title = findBlock(blocks, 'about_highlight_1_title');
    const highlight1Desc = findBlock(blocks, 'about_highlight_1_desc');

    const highlight2Icon = findBlock(blocks, 'about_highlight_2_icon');
    const highlight2Title = findBlock(blocks, 'about_highlight_2_title');
    const highlight2Desc = findBlock(blocks, 'about_highlight_2_desc');

    const button1 = findBlock(blocks, 'about_button_1');
    const button2 = findBlock(blocks, 'about_button_2');

    const HighlightIcon1 = availableIcons.find(i => i.name === highlight1Icon?.content.icon)?.component;
    const HighlightIcon2 = availableIcons.find(i => i.name === highlight2Icon?.content.icon)?.component;

    return (
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
                {heading && <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">{heading.content.text}</div>}
                {title && <h2 className="text-4xl font-bold">{title.content.text}</h2>}
                
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        {HighlightIcon1 && <HighlightIcon1 className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />}
                        <div>
                            {highlight1Title && <h3 className="font-semibold text-xl">{highlight1Title.content.text}</h3>}
                            {highlight1Desc && <p className="text-gray-600">{highlight1Desc.content.text}</p>}
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        {HighlightIcon2 && <HighlightIcon2 className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />}
                        <div>
                            {highlight2Title && <h3 className="font-semibold text-xl">{highlight2Title.content.text}</h3>}
                            {highlight2Desc && <p className="text-gray-600">{highlight2Desc.content.text}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    {button1 && <Button size="lg">{button1.content.text}</Button>}
                    {button2 && <Button size="lg" variant="outline">{button2.content.text}</Button>}
                </div>
            </div>
            <div>
                {image && <img src={image.content.url} alt={image.content.alt || 'About us'} className="rounded-xl shadow-2xl" />}
            </div>
        </div>
    );
}
  
  export function FeaturesSectionPreview({ blocks }: SectionPreviewProps) {
    const features = blocks.filter(b => b.block_type === 'feature');
  
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => {
            const Icon = availableIcons.find(icon => icon.name === feature.content.icon)?.component;
            return (
                <Card key={i}>
                    <CardHeader>
                        {Icon && <Icon className="h-8 w-8 mb-4" />}
                        <CardTitle>{feature.content.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{feature.content.description}</p>
                    </CardContent>
                </Card>
            )
        })}
      </div>
    );
  }

  export function StatsSectionPreview({ blocks }: SectionPreviewProps) {
    const stats = blocks.filter(b => b.block_type === 'stat');
  
    return (
      <div className="grid md:grid-cols-4 gap-4 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold">{stat.content.value}</p>
            <p className="text-gray-500">{stat.content.label}</p>
          </div>
        ))}
      </div>
    );
  }

  export function FeaturedProductsSectionPreview({ blocks }: SectionPreviewProps) {
    const title = findBlock(blocks, 'featured_products_title');
    return (
        <div>
            {title && <h2 className="text-3xl font-bold text-center mb-8">{title.content.text}</h2>}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Placeholder for products */}
                <Card><CardContent className="p-4">Product 1</CardContent></Card>
                <Card><CardContent className="p-4">Product 2</CardContent></Card>
                <Card><CardContent className="p-4">Product 3</CardContent></Card>
            </div>
        </div>
    );
}

export function TrustedPartnersSectionPreview({ blocks }: SectionPreviewProps) {
    const logos = blocks.filter(b => 
      b.block_key.startsWith('partner_logo_') && 
      b.block_type === 'image'
    );
    return (
        <div className="flex justify-center items-center gap-8">
            {logos.map((logo, i) => (
                <img key={i} src={logo.content.url} alt={logo.content.alt || `Partner ${i+1}` } className="h-12" />
            ))}
        </div>
    );
}

export function CtaSectionPreview({ blocks }: SectionPreviewProps) {
    const title = findBlock(blocks, 'cta_title');
    const subtitle = findBlock(blocks, 'cta_subtitle');
    const button1 = findBlock(blocks, 'cta_button_1');
    const button2 = findBlock(blocks, 'cta_button_2');

    return (
        <div className="bg-blue-600 text-white p-16 rounded-lg text-center">
            {title && <h2 className="text-4xl font-bold mb-4">{title.content.text}</h2>}
            {subtitle && <p className="text-xl mb-8">{subtitle.content.text}</p>}
            <div className="flex justify-center gap-4">
                {button1 && <Button size="lg" variant="secondary">{button1.content.text}</Button>}
                {button2 && <Button size="lg" variant="outline">{button2.content.text}</Button>}
            </div>
        </div>
    )
}