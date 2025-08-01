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

// Color mapping for safe Tailwind classes
const colorVariants = {
  // Background colors for icon containers
  backgrounds: {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    indigo: 'bg-indigo-100',
    pink: 'bg-pink-100',
    gray: 'bg-gray-100',
    teal: 'bg-teal-100',
    orange: 'bg-orange-100'
  },
  // Text colors for icons and links
  textColors: {
    blue: 'text-blue-700',
    green: 'text-green-700',
    purple: 'text-purple-700',
    red: 'text-red-700',
    yellow: 'text-yellow-700',
    indigo: 'text-indigo-700',
    pink: 'text-pink-700',
    gray: 'text-gray-700',
    teal: 'text-teal-700',
    orange: 'text-orange-700'
  },
  // Border colors
  borderColors: {
    blue: 'border-blue-200',
    green: 'border-green-200',
    purple: 'border-purple-200',
    red: 'border-red-200',
    yellow: 'border-yellow-200',
    indigo: 'border-indigo-200',
    pink: 'border-pink-200',
    gray: 'border-gray-200',
    teal: 'border-teal-200',
    orange: 'border-orange-200'
  },
  // Hover background colors
  hoverColors: {
    blue: 'hover:bg-blue-50',
    green: 'hover:bg-green-50',
    purple: 'hover:bg-purple-50',
    red: 'hover:bg-red-50',
    yellow: 'hover:bg-yellow-50',
    indigo: 'hover:bg-indigo-50',
    pink: 'hover:bg-pink-50',
    gray: 'hover:bg-gray-50',
    teal: 'hover:bg-teal-50',
    orange: 'hover:bg-orange-50'
  }
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

  // Function to get color variant or fallback to default
  const getColorClass = (colorKey: string | undefined, variant: keyof typeof colorVariants, fallback: string) => {
    if (!colorKey) return fallback;
    const colorMap = colorVariants[variant] as Record<string, string>;
    return colorMap[colorKey] || fallback;
  };

  // Simple translation function - replace with your actual implementation
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'general.learnMore': 'Learn More'
    };
    return translations[key] || key;
  };

  // Default color themes for each card if no color is specified
  const defaultThemes = ['blue', 'green', 'purple'];

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
          {features.map((featureBlock, index) => {
            // Extract color theme from content or use default
            const colorTheme = featureBlock.content.colorTheme || defaultThemes[index % defaultThemes.length];
            
            // Get all color classes
            const iconBgClass = getColorClass(colorTheme, 'backgrounds', 'bg-blue-100');
            const iconTextClass = getColorClass(colorTheme, 'textColors', 'text-blue-700');
            const borderClass = getColorClass(colorTheme, 'borderColors', 'border-gray-200');
            const hoverClass = getColorClass(colorTheme, 'hoverColors', 'hover:bg-gray-50');

            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                key={featureBlock.id}
                className={`bg-white rounded-xl shadow-lg border ${borderClass} p-8 ${hoverClass} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className={`${iconBgClass} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  {renderIcon(featureBlock.content.icon, `${iconTextClass} h-7 w-7`)}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-secondary">{featureBlock.content.title}</h3>
                <p className="text-gray-600">{featureBlock.content.description}</p>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={`/${locale}/services`}
                    className={`inline-flex items-center font-medium ${iconTextClass} hover:underline transition-colors duration-200`}
                  >
                    {t('general.learnMore')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}