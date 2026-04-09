'use client';

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type HomeSection, type HomeContentBlock } from "@/lib/api";

// Icon mapping
import { 
  Award, 
  Clock, 
  Shield, 
  Globe, 
  Truck, 
  CheckCircle, 
  Play,
  PenTool 
} from "lucide-react";

const IconMap: Record<string, any> = {
  Award,
  Clock,
  Shield,
  Globe,
  Truck,
  CheckCircle,
  Play,
  PenTool
};

interface CTASectionClientProps {
  section: HomeSection & { content_blocks: HomeContentBlock[] };
  contentBlocks: {
    heading?: HomeContentBlock;
    title?: HomeContentBlock;
    description?: HomeContentBlock;
    button?: HomeContentBlock;
  };
}

export default function CTASectionClient({ 
  section, 
  contentBlocks
}: CTASectionClientProps) {
  if (!section?.is_enabled) return null;

  const { ref: inViewRef, inView: isVisible } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const renderIcon = (iconName: string, className: string = "") => {
    const IconComponent = IconMap[iconName];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  // Get CTA features and buttons from the section's content blocks
  const ctaFeatures = section.content_blocks?.filter(block => 
    block.block_type === 'feature' && block.is_enabled
  ) || [];
  
  const ctaButtons = section.content_blocks?.filter(block => 
    block.block_type === 'button' && block.is_enabled
  ) || [];

  return (
    <section ref={inViewRef} className="py-24 bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-3 right-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/3  -translate-y-1/3" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {contentBlocks.heading && (
            <Badge className="bg-white/20 text-white hover:bg-white/30 px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
              {contentBlocks.heading.content.text}
            </Badge>
          )}
          
          {contentBlocks.title && (
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {contentBlocks.title.content.text}
            </h2>
          )}
          
          {contentBlocks.description && (
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
              {contentBlocks.description.content.text}
            </p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto">
            {ctaFeatures.map((ctaFeature, index) => (
              <div key={ctaFeature.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-left hover:bg-white/20 transition-colors duration-300">
                {renderIcon(ctaFeature.content.icon, 'h-6 w-6 mb-4 text-white/90')}
                <h3 className="text-lg font-semibold mb-2">{ctaFeature.content.title}</h3>
                <p className="text-sm text-white/80">{ctaFeature.content.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            {ctaButtons.map((buttonBlock, index) => (
              <Button 
                key={buttonBlock.id}
                asChild
                size="lg" 
                className={
                  buttonBlock.content.variant === 'primary' 
                    ? "bg-white text-primary hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                    : "border-2 border-white text-white bg-white/20 hover:scale-105 transition-all duration-300"
                }
                variant={buttonBlock.content.variant === 'primary' ? 'default' : 'outline'}
              >
                <Link href={buttonBlock.content.link}>
                  {buttonBlock.content.text}
                </Link>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 