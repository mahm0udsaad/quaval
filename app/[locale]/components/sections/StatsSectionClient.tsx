'use client';

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { type HomeSection, type HomeContentBlock } from "@/lib/api";

interface StatsSectionClientProps {
  section: HomeSection & { content_blocks: HomeContentBlock[] };
  stats: HomeContentBlock[];
}

export default function StatsSectionClient({ 
  section, 
  stats
}: StatsSectionClientProps) {
  if (!section?.is_enabled) return null;
  
  const statsRef = useRef(null);
  const { ref: inViewRef, inView: isVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Hardcoded gradient colors for each stat position
  const hardcodedGradients = [
    'from-blue-500 to-blue-600',      // First stat
    'from-emerald-500 to-emerald-600', // Second stat
    'from-amber-500 to-amber-600',     // Third stat
    'from-purple-500 to-purple-600'    // Fourth stat
  ];
  
  // Debug logging
  console.log('Section:', section);
  console.log('Stats data:', stats);
  console.log('Stats length:', stats.length);
  
  if (stats.length === 0) {
    console.log('⚠️ No stats to display!');
    return (
      <section ref={statsRef} className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500 p-8">
            DEBUG: No stats found to display
            <br />
            Stats received: {stats.length} items
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section ref={inViewRef} className="py-16 bg-white relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((statBlock, index) => {
            // Use hardcoded gradient based on index, fallback to blue if more than 4 stats
            const gradientColor = hardcodedGradients[index] || 'from-blue-500 to-blue-600';
            
            console.log(`Rendering stat ${index}:`, {
              id: statBlock.id,
              content: statBlock.content,
              value: statBlock.content?.value,
              label: statBlock.content?.label,
              hardcodedColor: gradientColor
            });
            
            return (
            <motion.div
              key={statBlock.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="p-8 rounded-xl bg-white shadow-xl border border-gray-100 h-full flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className={`absolute -bottom-2 -right-2 w-24 h-24 rounded-full bg-gradient-to-br ${gradientColor} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className={`text-5xl font-bold mb-3 bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
                  {statBlock.content.value}
                </div>
                <div className="text-gray-700 text-center font-medium">{statBlock.content.label}</div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}