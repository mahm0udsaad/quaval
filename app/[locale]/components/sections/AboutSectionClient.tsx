'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type HomeSection, type HomeContentBlock } from '@/lib/api';

// icon mapping
import { Award, Clock, Shield, Globe, Truck, CheckCircle, PenTool } from 'lucide-react';
const iconMap: Record<string, any> = { Award, Clock, Shield, Globe, Truck, CheckCircle, PenTool };

interface AboutSectionClientProps {
  section: HomeSection & { content_blocks: HomeContentBlock[] };
  contentBlocks: Record<string, HomeContentBlock | undefined>;
  locale: string;
}

export default function AboutSectionClient({ section, contentBlocks, locale }: AboutSectionClientProps) {
  const { heading, title, highlight1Icon, highlight1Title, highlight1Desc, highlight2Icon, highlight2Title, highlight2Desc,
          policyTitle, policyContent, missionTitle, missionContent, missionBenefits,
          image, historyTitle, historyContent, historySource, button1, button2 } = contentBlocks;

  if (!section?.is_enabled) return null;
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const renderIcon = (name: string) => {
    const Icon = iconMap[name] || Globe;
    return <Icon className="h-6 w-6 text-primary" aria-hidden />;
  };

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {heading && (
            <Badge className="bg-primary/10 text-primary mb-4 normal-case">
              {heading.content.text}
            </Badge>
          )}
          {title && (
            <h2 className="text-3xl font-semibold text-gray-800 leading-snug">
              {title.content.text.toLowerCase()}
            </h2>
          )}
        </motion.div>

        {/* highlights & image grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* highlights column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* highlight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow">
                <div className="p-2 bg-primary/20 rounded-md">
                  {renderIcon(highlight1Icon?.content.icon)}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-1 normal-case">
                    {highlight1Title?.content.text.toLowerCase()}
                  </h4>
                  <p className="text-gray-600">
                    {highlight1Desc?.content.text}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow">
                <div className="p-2 bg-primary/20 rounded-md">
                  {renderIcon(highlight2Icon?.content.icon)}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-1 normal-case">
                    {highlight2Title?.content.text.toLowerCase()}
                  </h4>
                  <p className="text-gray-600">
                    {highlight2Desc?.content.text}
                  </p>
                </div>
              </div>
            </div>

            {/* policy */}
            {policyTitle && (
              <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="text-xl font-medium text-gray-800 mb-2 normal-case">
                  {policyTitle.content.text.toLowerCase()}
                </h4>
                <p className="text-gray-600">
                  {policyContent?.content.text}
                </p>
              </div>
            )}

            {/* mission */}
            {missionTitle && (
              <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="text-xl font-medium text-gray-800 mb-2 normal-case">
                  {missionTitle.content.text.toLowerCase()}
                </h4>
                <p className="text-gray-600">
                  {missionContent?.content.text}
                </p>
                <p className="text-gray-600 mt-2">
                  {missionBenefits?.content.text}
                </p>
              </div>
            )}

            {/* actions */}
            <div className="flex flex-wrap gap-4">
              {button1 && (
                <Button size="lg" className="px-6 normal-case">
                  <Link href={button1.content.link || `/${locale}/about`}>
                    <span className="flex items-center gap-2">
                      {button1.content.text.toLowerCase()}
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </Link>
                </Button>
              )}
              {button2 && (
                <Button variant="outline" size="lg" className="px-6 normal-case">
                  <Link href={button2.content.link || `/${locale}/contact`}>
                    {button2.content.text.toLowerCase()}
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>

          {/* image column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            {image && (
              <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={image.content.url}
                  alt={image.content.alt}
                  width={500}
                  height={350}
                  className="object-cover"
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* history full width */}
        {historyTitle && historyContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 px-6"
          >
            <div className="mx-auto max-w-4xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center normal-case">
                {historyTitle.content.text.toLowerCase()}
              </h3>
              <div className="space-y-6">
                {historyContent.content.text.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed lowercase">
                    {para}
                  </p>
                ))}
                {historySource && (
                  <p className="text-sm text-gray-500 italic text-transform lowercase">
                    {historySource.content.text}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}