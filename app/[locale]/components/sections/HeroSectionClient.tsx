'use client';

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HomeCarousel from "../HomeCarousel";
import { type HomeSection, type HomeContentBlock } from "@/lib/api";

interface HeroSectionClientProps {
  sectionData: HomeSection & { content_blocks: HomeContentBlock[] };
}

export default function HeroSectionClient({ sectionData }: HeroSectionClientProps) {
  const heroRef = useRef(null);
  
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.5], [1, 1.1]);

  return (
    <section ref={heroRef} className="relative min-h-[700px] flex items-center overflow-hidden">
      {/* Background Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          scale: heroScale,
          opacity: heroOpacity
        }}
      >
        <HomeCarousel />
      </motion.div>
    </section>
  );
}