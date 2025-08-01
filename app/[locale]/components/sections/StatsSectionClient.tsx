'use client';

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { type HomeSection, type HomeContentBlock } from "@/lib/api";

interface StatsSectionClientProps {
  section: HomeSection & { content_blocks: HomeContentBlock[] };
  stats: HomeContentBlock[];
}

// Custom hook for counter animation
const useCounter = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end at the exact number
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start]);
  
  return count;
};

// Component for individual animated stat
const AnimatedStat = ({ 
  statBlock, 
  index, 
  gradientClass, 
  isVisible 
}: {
  statBlock: HomeContentBlock;
  index: number;
  gradientClass: any;
  isVisible: boolean;
}) => {
  // Extract number from the value string
  const extractNumber = (value: string): number => {
    // Remove any non-numeric characters except decimal points
    const numericValue = value.replace(/[^\d.]/g, '');
    return parseFloat(numericValue) || 0;
  };
  
  // Extract suffix (like +, K, M, %, etc.)
  const extractSuffix = (value: string): string => {
    const match = value.match(/[^\d.]+$/);
    return match ? match[0] : '';
  };
  
  const targetNumber = extractNumber(statBlock.content.value);
  const suffix = extractSuffix(statBlock.content.value);
  
  // Use counter hook with staggered start
  const [shouldStart, setShouldStart] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShouldStart(true);
      }, index * 100); // Stagger each counter by 100ms
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, index]);
  
  const animatedValue = useCounter(targetNumber, 2000, shouldStart);
  
  // Format the number (add commas for thousands)
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };
  
  return (
    <motion.div
      key={statBlock.id}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      <div className="p-8 rounded-xl bg-white shadow-xl border border-gray-100 h-full flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
        {/* Background gradient circle */}
        <div className={`absolute -bottom-2 -right-2 w-24 h-24 rounded-full bg-gradient-to-br ${gradientClass.bg} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
        
        {/* Animated stat value with gradient text */}
        <div className={`text-5xl font-bold mb-3 bg-gradient-to-r ${gradientClass.text} bg-clip-text text-transparent`}>
          {formatNumber(animatedValue)}{suffix}
        </div>
        
        {/* Stat label */}
        <div className="text-gray-700 text-center font-medium">
          {statBlock.content.label}
        </div>
      </div>
    </motion.div>
  );
};

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
  
  // Predefined gradient classes that Tailwind recognizes
  const gradientClasses = [
    {
      bg: 'from-blue-500 to-blue-600',
      bgOpacity: 'from-blue-500/10 to-blue-600/20',
      text: 'from-blue-500 to-blue-600'
    },
    {
      bg: 'from-emerald-500 to-emerald-600',
      bgOpacity: 'from-emerald-500/10 to-emerald-600/20',
      text: 'from-emerald-500 to-emerald-600'
    },
    {
      bg: 'from-amber-500 to-amber-600',
      bgOpacity: 'from-amber-500/10 to-amber-600/20',
      text: 'from-amber-500 to-amber-600'
    },
    {
      bg: 'from-purple-500 to-purple-600',
      bgOpacity: 'from-purple-500/10 to-purple-600/20',
      text: 'from-purple-500 to-purple-600'
    }
  ];
  
  if (stats.length === 0) {
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
            // Get gradient classes based on index, fallback to blue if more than 4 stats
            const gradientClass = gradientClasses[index] || gradientClasses[0];
 
            return (
              <AnimatedStat
                key={statBlock.id}
                statBlock={statBlock}
                index={index}
                gradientClass={gradientClass}
                isVisible={isVisible}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}