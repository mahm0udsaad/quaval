'use client';

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { type HomeSection, type HomeContentBlock } from "@/lib/api";

interface TrustedPartnersSectionClientProps {
  section: HomeSection & { content_blocks: HomeContentBlock[] };
  contentBlocks: {
    heading?: HomeContentBlock;
    title?: HomeContentBlock;
  };
  partners: HomeContentBlock[];
}

export default function TrustedPartnersSectionClient({ 
  section, 
  contentBlocks,
  partners
}: TrustedPartnersSectionClientProps) {
  if (!section?.is_enabled) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {contentBlocks.heading && (
            <Badge className="bg-gray-200 text-gray-700 px-3 py-1 text-sm font-medium mb-4">
              {contentBlocks.heading.content.text}
            </Badge>
          )}
          
          {contentBlocks.title && (
            <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-4">
              {contentBlocks.title.content.text}
            </h2>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((logoBlock, index) => (
            <div key={logoBlock.id} className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
              <Image
                src={logoBlock.content.url}
                alt={logoBlock.content.alt}
                width={120}
                height={60}
                className="object-contain h-12"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 