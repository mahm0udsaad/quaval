'use client';

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

interface FeaturesSectionClientProps {
  section: HomeSection & { content_blocks: HomeContentBlock[] };
  contentBlocks: {
    heading?: HomeContentBlock;
    title?: HomeContentBlock;
    description?: HomeContentBlock;
  };
  features: HomeContentBlock[];
  locale: string;
}

export default function FeaturesSectionClient({ 
  section, 
  contentBlocks,
  features,
  locale
}: FeaturesSectionClientProps) {
  if (!section?.is_enabled) return null;

  const { ref: inViewRef, inView: isVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const renderIcon = (iconName: string, className: string = "") => {
    const IconComponent = IconMap[iconName];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  // Simple translation function - replace with your actual implementation
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'general.learnMore': 'Learn More'
    };
    return translations[key] || key;
  };

  return (
    <section ref={inViewRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {contentBlocks.heading && (
            <Badge className="bg-primary hover:bg-primary text-white px-3 py-1 text-sm font-medium mb-4">
              {contentBlocks.heading.content.text}
            </Badge>
          )}
          
          {contentBlocks.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              {contentBlocks.title.content.text}
            </h2>
          )}
          
          {contentBlocks.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {contentBlocks.description.content.text}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((featureBlock, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              key={featureBlock.id}
              className={`bg-white rounded-xl shadow-lg border ${featureBlock.content.borderColor || 'border-gray-200'} p-8 ${featureBlock.content.hoverColor || 'hover:bg-gray-50'} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className={`${featureBlock.content.color || 'bg-blue-100'} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                {renderIcon(featureBlock.content.icon, `${featureBlock.content.textColor || 'text-blue-700'} h-7 w-7`)}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-secondary">{featureBlock.content.title}</h3>
              <p className="text-gray-600">{featureBlock.content.description}</p>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href={`/${locale}/services`}
                  className={`inline-flex items-center font-medium ${featureBlock.content.textColor || 'text-blue-700'}`}
                >
                  {t('general.learnMore')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 