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
  
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.8], [1, 1.15]);
  const contentY = useTransform(heroScrollProgress, [0, 0.5], [0, -100]);
  const overlayOpacity = useTransform(heroScrollProgress, [0, 0.4], [0.4, 0.7]);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Enhanced Background Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          scale: heroScale,
          opacity: heroOpacity
        }}
      >
        <HomeCarousel />
        
        {/* Dynamic Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-purple-900/40"
          style={{ opacity: overlayOpacity }}
        />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Enhanced Content Container */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8"
        style={{ y: contentY }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading with Stagger Animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Professional
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Excellence
              </span>
            </h1>
          </motion.div>

          {/* Subtitle with Typewriter Effect */}
          <motion.p 
            className="text-xl sm:text-2xl text-white/90 mb-12 font-light leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Delivering innovative solutions with 
            <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> cutting-edge technology</span> and unmatched expertise
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.button>
            
            <motion.button
              className="group px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                Learn More
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>
            </motion.button>
          </motion.div>

          {/* Floating Stats Preview */}
          <motion.div 
            className="mt-16 flex flex-wrap justify-center gap-8 opacity-80"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {[
              { value: "15+", label: "Years" },
              { value: "500+", label: "Clients" },
              { value: "99%", label: "Success" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="backdrop-blur-md bg-white/10 rounded-xl px-6 py-4 border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div 
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-white/20 rounded-full opacity-30 animate-pulse" />
      <div className="absolute bottom-32 right-16 w-16 h-16 border border-blue-400/30 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-20 w-12 h-12 border border-purple-400/30 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  );
}