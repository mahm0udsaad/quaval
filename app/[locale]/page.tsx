'use client';

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Award, 
  Clock, 
  Shield, 
  ChevronRight,
  Globe,
  Truck,
  CheckCircle,
  Play,
  PenTool
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import HomeCarousel from "./components/HomeCarousel";
import FeaturedProducts from "./components/FeaturedProducts";
import { useTranslate } from "@/lib/i18n-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { t, locale } = useTranslate();
  const [isVisible, setIsVisible] = useState({
    stats: false,
    features: false,
    about: false,
  });
  
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const heroRef = useRef(null);
  
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.5], [1, 1.1]);
  const heroY = useTransform(heroScrollProgress, [0, 0.5], [0, 100]);
  
  // Observer for elements
  useEffect(() => {
    const observers = [
      { ref: statsRef, key: 'stats' },
      { ref: featuresRef, key: 'features' },
      { ref: aboutRef, key: 'about' },
    ].map(({ ref, key }) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [key]: true }));
            // Unobserve after becoming visible
            if (ref.current) {
              observer.unobserve(ref.current);
            }
          }
        },
        { threshold: 0.1 }
      );
      
      if (ref.current) {
        observer.observe(ref.current);
      }
      
      return observer;
    });
    
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);
  
  const features = [
    {
      icon: Award,
      title: t('home.feature1Title'),
      description: t('home.feature1Desc'),
      color: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      hoverColor: "hover:bg-blue-50",
    },
    {
      icon: Clock,
      title: t('home.feature2Title'),
      description: t('home.feature2Desc'),
      color: "bg-emerald-100",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      hoverColor: "hover:bg-emerald-50",
    },
    {
      icon: Shield,
      title: t('home.feature3Title'),
      description: t('home.feature3Desc'),
      color: "bg-purple-100",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      hoverColor: "hover:bg-purple-50",
    },
  ];
  
  const stats = [
    { 
      value: "15+", 
      label: t('home.yearsExperience'),
      color: "from-blue-500 to-blue-600" 
    },
    { 
      value: "1000+", 
      label: t('home.productsCount'),
      color: "from-emerald-500 to-emerald-600" 
    },
    { 
      value: "500+", 
      label: t('home.clientsCount'),
      color: "from-amber-500 to-amber-600" 
    },
    { 
      value: "99%", 
      label: t('home.satisfactionRate'),
      color: "from-purple-500 to-purple-600" 
    },
  ];

  const clients = [
    "/placeholder-logo.svg", 
    "/placeholder-logo.svg", 
    "/placeholder-logo.svg", 
    "/placeholder-logo.svg", 
    "/placeholder-logo.svg", 
    "/placeholder-logo.svg", 
  ];
  
  return (
    <div className="bg-background overflow-hidden">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
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

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="p-8 rounded-xl bg-white shadow-xl border border-gray-100 h-full flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <div className={`absolute -bottom-2 -right-2 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                  <div className={`text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-700 text-center font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible.about ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-secondary hover:bg-secondary text-white px-3 py-1 text-sm font-medium mb-6">
                {t('home.aboutHeading')}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary">
                {t('home.aboutTitle')}
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-blue-100 text-blue-700">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-secondary">
                      {t('home.aboutHighlight1')}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t('home.aboutText1')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <PenTool className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-secondary">
                      {t('home.aboutHighlight2')}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t('home.aboutText2')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <Button asChild variant="default">
                  <Link href={`/${locale}/about`} className="flex items-center">
                    {t('navigation.about')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline">
                  <Link href={`/${locale}/contact`}>
                    {t('navigation.contact')}
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.about ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video lg:aspect-square">
                <div className="absolute inset-0 bg-primary/10 z-10" />
                <Image
                  src="https://www.quaval.ca/images/home/mission03.jpg"
                  alt="Quaval Bearings Facility"
                  fill
                  className="object-cover"
                />
                
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

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-primary hover:bg-primary text-white px-3 py-1 text-sm font-medium mb-4">
              {t('general.welcome')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              {t('home.featuresTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.featuresSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                key={index}
                className={`bg-white rounded-xl shadow-lg border ${item.borderColor} p-8 ${item.hoverColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className={`${item.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <item.icon className={`${item.textColor}`} size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-secondary">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={`/${locale}/services`}
                    className={`inline-flex items-center font-medium ${item.textColor}`}
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

      {/* Featured Products Section with Advanced Animation */}
      <FeaturedProducts />

      {/* Trusted By Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-gray-200 text-gray-700 px-3 py-1 text-sm font-medium mb-4">
              {t('home.trustedBy')}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-4">
              {t('home.partnersTitle')}
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {clients.map((client, index) => (
              <div key={index} className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
                <Image
                  src={client}
                  alt={t('home.clientLogoAlt', { number: index + 1 })}
                  width={120}
                  height={60}
                  className="object-contain h-12"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-3 right-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/3  -translate-y-1/3" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-white/20 text-white hover:bg-white/30 px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
              {t('home.ctaBadge')}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('home.ctaTitle')}</h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
              {t('home.ctaText')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-left hover:bg-white/20 transition-colors duration-300">
                <Truck className="h-6 w-6 mb-4 text-white/90" />
                <h3 className="text-lg font-semibold mb-2">{t('home.ctaFeature1')}</h3>
                <p className="text-sm text-white/80">{t('home.ctaFeature1Desc')}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-left hover:bg-white/20 transition-colors duration-300">
                <CheckCircle className="h-6 w-6 mb-4 text-white/90" />
                <h3 className="text-lg font-semibold mb-2">{t('home.ctaFeature2')}</h3>
                <p className="text-sm text-white/80">{t('home.ctaFeature2Desc')}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-left hover:bg-white/20 transition-colors duration-300">
                <PenTool className="h-6 w-6 mb-4 text-white/90" />
                <h3 className="text-lg font-semibold mb-2">{t('home.ctaFeature3')}</h3>
                <p className="text-sm text-white/80">{t('home.ctaFeature3Desc')}</p>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100 hover:scale-105 transition-all duration-300"
              >
                <Link href={`/${locale}/products`}>
                  {t('general.viewDetails')}
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <Link href={`/${locale}/contact`}>
                  {t('general.bookNow')}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}