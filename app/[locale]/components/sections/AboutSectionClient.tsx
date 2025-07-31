'use client';

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
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

interface AboutSectionClientProps {
  section: HomeSection & { content_blocks: HomeContentBlock[] };
  contentBlocks: {
    heading?: HomeContentBlock;
    title?: HomeContentBlock;
    highlight1Icon?: HomeContentBlock;
    highlight1Title?: HomeContentBlock;
    highlight1Desc?: HomeContentBlock;
    highlight2Icon?: HomeContentBlock;
    highlight2Title?: HomeContentBlock;
    highlight2Desc?: HomeContentBlock;
    button1?: HomeContentBlock;
    button2?: HomeContentBlock;
    image?: HomeContentBlock;
    policyTitle?: HomeContentBlock;
    policyContent?: HomeContentBlock;
    missionTitle?: HomeContentBlock;
    missionContent?: HomeContentBlock;
    missionBenefits?: HomeContentBlock;
    historyTitle?: HomeContentBlock;
    historyContent?: HomeContentBlock;
    historySource?: HomeContentBlock;
  };
  locale: string;
}

export default function AboutSectionClient({ 
  section, 
  contentBlocks,
  locale
}: AboutSectionClientProps) {
  if (!section?.is_enabled) return null;

  const aboutRef = useRef(null);
  const { ref: inViewRef, inView: isVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const renderIcon = (iconName: string, className: string = "") => {
    const IconComponent = IconMap[iconName];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <section ref={inViewRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {contentBlocks.heading && (
              <Badge className="bg-secondary hover:bg-secondary text-white px-3 py-1 text-sm font-medium mb-6">
                {contentBlocks.heading.content.text}
              </Badge>
            )}
            
            {contentBlocks.title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary">
                {contentBlocks.title.content.text}
              </h2>
            )}
            
            <div className="space-y-6">
              {/* About Highlight 1 */}
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-blue-100 text-blue-700">
                  {renderIcon(contentBlocks.highlight1Icon?.content.icon || 'Globe', 'h-5 w-5')}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-secondary">
                    {contentBlocks.highlight1Title?.content.text || 'Global Reach'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {contentBlocks.highlight1Desc?.content.text || 'Serving customers worldwide'}
                  </p>
                </div>
              </div>
              
              {/* About Highlight 2 */}
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  {renderIcon(contentBlocks.highlight2Icon?.content.icon || 'PenTool', 'h-5 w-5')}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-secondary">
                    {contentBlocks.highlight2Title?.content.text || 'Custom Solutions'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {contentBlocks.highlight2Desc?.content.text || 'Tailored solutions'}
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Section */}
            {contentBlocks.policyTitle && (
              <div className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold text-secondary">
                  {contentBlocks.policyTitle.content.text}
                </h3>
                {contentBlocks.policyContent && (
                  <p className="text-lg font-semibold text-primary">
                    {contentBlocks.policyContent.content.text}
                  </p>
                )}
              </div>
            )}

            {/* Mission Section */}
            {contentBlocks.missionTitle && (
              <div className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold text-secondary">
                  {contentBlocks.missionTitle.content.text}
                </h3>
                {contentBlocks.missionContent && (
                  <p className="text-gray-700 leading-relaxed">
                    {contentBlocks.missionContent.content.text}
                  </p>
                )}
                {contentBlocks.missionBenefits && (
                  <p className="text-gray-700 leading-relaxed">
                    {contentBlocks.missionBenefits.content.text}
                  </p>
                )}
              </div>
            )}

            {/* History Section */}
            {contentBlocks.historyTitle && (
              <div className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold text-secondary">
                  {contentBlocks.historyTitle.content.text}
                </h3>
                {contentBlocks.historyContent && (
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {contentBlocks.historyContent.content.text.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
                {contentBlocks.historySource && (
                  <p className="text-sm text-gray-500 italic mt-4">
                    {contentBlocks.historySource.content.text}
                  </p>
                )}
              </div>
            )}
            
            <div className="mt-8 flex gap-4">
              {contentBlocks.button1 && (
                <Button asChild variant="default">
                  <Link href={contentBlocks.button1.content.link || `/${locale}/about`} className="flex items-center">
                    {contentBlocks.button1.content.text || 'Learn More'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              
              {contentBlocks.button2 && (
                <Button asChild variant="outline">
                  <Link href={contentBlocks.button2.content.link || `/${locale}/contact`}>
                    {contentBlocks.button2.content.text || 'Contact Us'}
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video lg:aspect-square">
              <div className="absolute inset-0 bg-primary/10 z-10" />
              {contentBlocks.image && (
                <Image
                  src={contentBlocks.image.content.url || "https://www.quaval.ca/images/home/mission03.jpg"}
                  alt={contentBlocks.image.content.alt || "About Quaval"}
                  fill
                  className="object-cover"
                />
              )}
              
              {/* Play button overlay */}
              <div id="about-video" className="absolute inset-0 flex items-center justify-center z-20">
                <Button 
                  variant="default"
                  size="icon"
                  className="rounded-full h-20 w-20 bg-primary/90 hover:bg-primary hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <Play className="h-8 w-8 text-white ml-1" />
                </Button>
              </div>
            </div>
            
            {/* Accent decorations */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-xl bg-blue-500/10 z-0" />
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border-8 border-primary/10 z-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 