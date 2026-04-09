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
            console.log(`Rendering stat ${index}:`, {
              id: statBlock.id,
              content: statBlock.content,
              value: statBlock.content?.value,
              label: statBlock.content?.label,
              color: statBlock.content?.color
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
                <div className={`absolute -bottom-2 -right-2 w-24 h-24 rounded-full bg-gradient-to-br ${statBlock.content.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className={`text-5xl font-bold mb-3 bg-gradient-to-r ${statBlock.content.color} bg-clip-text text-transparent`}>
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