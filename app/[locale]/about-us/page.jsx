'use client';

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Truck,
  ShoppingCart,
  Shield,
  ArrowRight,
  Building2,
  MapPin,
  Calendar,
  Award,
  ChevronRight,
  ExternalLink,
  Factory,
  BarChart3,
  TrendingUp,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslate } from "@/lib/i18n-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SUPABASE_STORAGE = "https://rvhmhbtacshzcicwrdjn.supabase.co/storage/v1/object/public/product-images";

// Brand logos for the "Who We Are" section - imported brands
const importedBrands = [
  { name: "FAG & INA", country: "Germany", logo: null },
  { name: "SKF", country: "Sweden", logo: null },
  { name: "NSK", country: "Japan", logo: null },
  { name: "NTN", country: "Japan", logo: null },
  { name: "KOYO", country: "Japan", logo: null },
  { name: "DODGE", country: "USA", logo: null },
  { name: "McGILL", country: "USA", logo: null },
  { name: "LINK-BELT", country: "USA", logo: null },
  { name: "KINEX", country: "Slovakia", logo: null },
  { name: "IKO", country: "Japan", logo: null },
  { name: "TIMKEN", country: "USA", logo: null },
  { name: "OZAK", country: "Japan", logo: null },
  { name: "KSM", country: "Japan", logo: null },
  { name: "STIEBER", country: "Germany", logo: null },
  { name: "NADELLA", country: "France", logo: null },
  { name: "HIWIN", country: "Taiwan", logo: null },
  { name: "KASHIMA", country: "Japan", logo: null },
  { name: "EASE", country: "Japan", logo: null },
  { name: "SAMICK", country: "Korea", logo: null },
  { name: "JMC", country: "Korea", logo: null },
];

// Company history timeline
const historyTimeline = [
  {
    year: "2019",
    title: "Company Establishment",
    description:
      "Quaval for Industrial Development Inc. was established in Quebec, building on over 33 years of experience in the importation and distribution of bearings. Became the exclusive distributor of the Kinex brand manufactured in Slovakia. Officially registered the Quaval trademark in Canada and launched manufacturing of Quaval-branded products for export.",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
  },
  {
    year: "2021",
    title: "US Market Expansion",
    description:
      "Successfully expanded export operations, supplying products to numerous companies across various industries throughout the United States.",
    icon: Globe,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    year: "2024",
    title: "Market Strengthening",
    description:
      "Strengthened position in the market by attracting trading companies across the U.S., achieving notable success in exporting a wide range of products, with a particular focus on obsolete and hard-to-find bearings.",
    icon: TrendingUp,
    color: "from-amber-500 to-amber-600",
  },
  {
    year: "2025",
    title: "Strategic Partnerships",
    description:
      "A significant milestone year. Became a distributor of the STC-Steyr brand in both Canada and the United States. Secured exclusive distribution rights for the DKF brand and became an authorized distributor of the DGWL brand across both markets.",
    icon: Award,
    color: "from-purple-500 to-purple-600",
  },
  {
    year: "2026",
    title: "JIB Exclusive Rights",
    description:
      "Continued expansion by obtaining the exclusive distribution rights for the JIB brand in Canada. Actively pursuing new opportunities and investing significant efforts to secure distribution agreements with more globally recognized and reputable brands.",
    icon: Package,
    color: "from-red-500 to-red-600",
  },
];

// Brand descriptions for "Our Brands" section
const brandDescriptions = [
  {
    name: "JIB",
    fullName: "JEIL Bearing Industrial Co., Ltd",
    founded: "1972",
    country: "Korea",
    homepage: "http://www.jeilbearing.co.kr",
    description:
      "Established with the concept of contributing to the bearing industry in Korea, JIB developed the unit ball bearing for the first time in Korea. They are the only manufacturer in Korea specializing in unit ball bearings. Having dominated the local market, JIB has been selling in over 50 nations including the EU and USA, paving the way for becoming a world-class bearing manufacturer.",
    products: "Ball Bearing Units, Spherical Roller Bearings",
    color: "border-blue-200 bg-blue-50",
    image: `${SUPABASE_STORAGE}/jib/unit-ball-bearing.jpg`,
  },
  {
    name: "STC-STEYR / DKF / DGWL",
    fullName: "DKF Deutsche Kugellagerfabriken GmbH",
    founded: "1904 & 1922",
    country: "Germany / Austria",
    homepage: "https://stc-steyr.com",
    description:
      "STC-Steyr is an international manufacturer of rolling bearings and accessories, manufacturing in series production in the traditional industrial location of Steyr, Austria, since 1922. Their manufacturing facilities are certified and audited by experienced engineers, with first-class, internationally recognised product quality. Germany is now Europe's biggest market in terms of rolling bearings.",
    products: "Rolling Bearings, Housings, Slewing Bearings",
    color: "border-red-200 bg-red-50",
    image: "/images/steyr_hist_01.jpg",
  },
  {
    name: "Quaval",
    fullName: "Quaval for Industrial Development Inc.",
    founded: "2019",
    country: "Canada",
    homepage: null,
    description:
      "Quaval is a Canadian trademark officially registered in Canada in 2019. Quaval produces almost all types of ball bearings using very high-quality materials and according to precise specifications. The brand also specializes in manufacturing obsolete or hard-to-find ball bearings and has provided many solutions to customers in the United States and Mexico.",
    products: "Ball Bearings, Custom/Obsolete Bearings",
    color: "border-emerald-200 bg-emerald-50",
    image: "/images/Logo-transparent.png",
  },
  {
    name: "Timken",
    fullName: "The Timken Company",
    founded: "1899",
    country: "USA",
    homepage: "http://www.timken.com",
    description:
      "Timken is a global technology leader in engineered bearings and industrial motion. In 1898, Henry Timken obtained a patent for an improved tapered roller bearing, and in 1899 incorporated as The Timken Roller Bearing Axle Company in St. Louis. Their expanding portfolio of next-generation solutions helps customers around the world improve efficiency and push the boundaries of performance.",
    products: "Tapered Roller Bearings, Engineered Bearings",
    color: "border-orange-200 bg-orange-50",
    image: `${SUPABASE_STORAGE}/timken/tapered-roller-bearings.jpg`,
  },
  {
    name: "OZAK",
    fullName: "Ozak Seiko Co., Ltd",
    founded: "1976",
    country: "Japan",
    homepage: "https://www.ozak.co.jp",
    description:
      "Ozak Seiko specializes in high precision Linear Motion Bearings. Established in 1976 in Saitama Prefecture, Japan, the company is equipped to handle a high degree of technical and engineering challenges. Ozak has pursued R&D of Linear Motion Bearings to improve and produce ideal products using a unique system in manufacturing.",
    products: "Linear Bearings, Linear Guides",
    color: "border-indigo-200 bg-indigo-50",
    image: `${SUPABASE_STORAGE}/ozak/standard-linear-bearings.jpg`,
  },
  {
    name: "EASE",
    fullName: "Ease Seiko Co., Ltd.",
    founded: "1968",
    country: "Japan",
    homepage: null,
    description:
      "Ease Seiko manufactures slide bearings, special bearings, and associated precision parts. Using state-of-the-art equipment and broad-spectrum production expertise acquired since founding, their products are widely reputed as being top quality and economical. Major clients include JTEKT Corporation, Koyo Sales Co., and THK Co., Ltd.",
    products: "Slide Bearings, Special Bearings, Precision Parts",
    color: "border-teal-200 bg-teal-50",
    image: `${SUPABASE_STORAGE}/ease/standard-linear-bearings.jpg`,
  },
  {
    name: "KINEX",
    fullName: "KINEX BEARINGS Group",
    founded: "1898",
    country: "Slovakia",
    homepage: null,
    description:
      "Mechanical engineering in Bytča has more than 120 years of history. The first bearing was produced in Slovakia in 1950 at the Kysucké Nové Mesto plant. KINEX has expanded its production to include bearings for various industries including textile, automotive, aviation, and rail vehicles. In 2000, KINEX incorporated ZVL Skalica as a production plant.",
    products: "Rolling Bearings, Aviation Bearings, Railway Bearings",
    color: "border-sky-200 bg-sky-50",
    image: "/images/history-kinex.jpg",
  },
  {
    name: "KSM",
    fullName: "Minamiguchi Bearing Mfg. Co., Ltd.",
    founded: "1958",
    country: "Japan",
    homepage: null,
    description:
      "KSM Bearings is a Japanese manufacturer established in 1958 in Osaka, specializing in high-quality, cost-effective ball bearings, needle roller bearings, spherical roller bearings, and mounted units. ISO 9001 certified, KSM is known for producing durable bearings for industrial, agricultural, and harsh environment applications.",
    products: "Ball Bearings, Needle Roller Bearings, Mounted Units",
    color: "border-violet-200 bg-violet-50",
    image: `${SUPABASE_STORAGE}/media/ksm-needle-roller-bearings.jpg`,
  },
  {
    name: "Samick",
    fullName: "SAMICK THK Co., Ltd.",
    founded: "1987",
    country: "Korea",
    homepage: null,
    description:
      "Samick Precision Ind. Co., Ltd manufactures Factory Automation related products with specialty in the production and sales of linear motion bearings. The company concentrates on being selected as world-class goods through form technical development, raising the name of the Republic of Korea in the global market.",
    products: "Linear Motion Bearings, Factory Automation Products",
    color: "border-pink-200 bg-pink-50",
    image: null,
  },
  {
    name: "JMC",
    fullName: "Jalman Precision Co., Ltd.",
    founded: "1974",
    country: "Korea",
    homepage: null,
    description:
      "Jalman has gained a strong reputation by contributing to the manufacturing industry in Korea. Jalman Precision Co., Ltd. has been playing an important role in the bearing industry through manufacture and supply of a wide variety of bearings under the brand name JMC, including bearings that were not previously available in Korea.",
    products: "Ball Joints, Rod Ends, Track Rollers, Spherical Plain Bearings",
    color: "border-cyan-200 bg-cyan-50",
    image: `${SUPABASE_STORAGE}/jmc/spherical-plain.jpg`,
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AboutPage() {
  const { t, locale } = useTranslate();

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary to-primary text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/about-us-02.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 to-primary/80" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <Badge className="bg-white/20 text-white hover:bg-white/30 px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
              About Quaval
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Trusted Partner in Industrial Bearings
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed">
              A Canadian corporation with 33 years of experience in the import, export, and distribution of rolling bearings worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInLeft}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-sm font-medium mb-4">
                Who We Are
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary">
                Canadian Excellence in Bearings Distribution
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We are a Canadian Corporation located in Laval, Quebec, with <strong className="text-secondary">33 years of experience</strong> in the import and distribution of rolling bearings.
                </p>
                <p>
                  We are the <strong className="text-secondary">exclusive distributor</strong> of JEIL Bearing Industrial Co., Ltd (JIB), which produces well-known ball bearings with a global reputation. Our company is also the distributor of STC-STEYR bearings in Canada and USA, manufactured by DKF Deutsche Kugellagerfabriken GmbH in Berlin, Germany.
                </p>
                <p>
                  We hold exclusive distribution rights for the DKF brand and serve as the authorized distributor of Deutsche Großwälzlager (DGWL) brand, both manufactured by DKF Deutsche Kugellagerfabriken GmbH.
                </p>
                <p>
                  As the owner of the <strong className="text-secondary">Quaval Trademark</strong> in Canada, Quaval is a Canadian Trademark for trusted Rolling Bearings.
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-primary">33+</div>
                  <div className="text-sm text-gray-500 mt-1">Years Experience</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-primary">20+</div>
                  <div className="text-sm text-gray-500 mt-1">Global Brands</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-primary">4</div>
                  <div className="text-sm text-gray-500 mt-1">Exclusive Brands</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInRight}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/about-us-02.jpg"
                      alt="Quaval Operations"
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/steyr_hist_01.jpg"
                      alt="Manufacturing Heritage"
                      width={400}
                      height={300}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/2017-08-21 POSTER PHOTO  FRONT.jpg"
                      alt="Quaval Products"
                      width={400}
                      height={350}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                  <div className="bg-primary rounded-2xl p-6 flex items-center justify-center text-white text-center shadow-lg">
                    <div>
                      <div className="text-4xl font-bold mb-2">33+</div>
                      <div className="text-sm text-white/90">Years of Excellence</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-xl bg-primary/10 -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border-8 border-primary/10 -z-10" />
            </motion.div>
          </div>

          {/* Imported Brands Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="mt-16"
          >
            <h3 className="text-xl font-semibold text-secondary mb-6 text-center">
              Brands We Import &amp; Distribute
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3">
              {importedBrands.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  variants={fadeInUp}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 rounded-xl p-3 text-center transition-all duration-300 group cursor-default"
                >
                  <div className="text-xs font-bold text-secondary group-hover:text-primary transition-colors">
                    {brand.name}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{brand.country}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1 text-sm font-medium mb-4">
              What We Do
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Import, Distribution &amp; Export
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Serving industrial and commercial companies across North America and the Middle East
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Import & Distribution",
                description:
                  "We import and distribute premium bearing brands across Canada to industrial and commercial companies. We also export to the United States, Mexico, and the Middle East.",
                color: "bg-blue-100",
                textColor: "text-blue-700",
                borderColor: "border-blue-200",
              },
              {
                icon: Truck,
                title: "Multiple Shipping Options",
                description:
                  "Large orders are shipped by sea or air, depending on client preferences and operational requirements. We also offer express shipping via courier upon request to save time.",
                color: "bg-emerald-100",
                textColor: "text-emerald-700",
                borderColor: "border-emerald-200",
              },
              {
                icon: ShoppingCart,
                title: "Online Purchasing",
                description:
                  "Customers can purchase directly from our website and complete payment online, with shipping arranged accordingly for maximum convenience.",
                color: "bg-amber-100",
                textColor: "text-amber-700",
                borderColor: "border-amber-200",
              },
              {
                icon: Shield,
                title: "Warranty Policy",
                description:
                  "Our company guarantees all products sold through us in accordance with a specific warranty policy tailored to each product, ensuring customer confidence.",
                color: "bg-purple-100",
                textColor: "text-purple-700",
                borderColor: "border-purple-200",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg border ${item.borderColor} p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}>
                  <item.icon className={item.textColor} size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-secondary">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company History Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 text-sm font-medium mb-4">
              Our Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Company History
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quaval for Industrial Development Inc. was established in 2019 in the province of Quebec, building on over 33 years of experience in the importation and distribution of bearings.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500 transform md:-translate-x-1/2" />

            {historyTimeline.map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-sm font-semibold mb-3`}>
                      <Calendar className="h-3.5 w-3.5" />
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Empty space for the other side */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Canada Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 text-sm font-medium mb-4">
              About Canada
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              A Strong Market for Industrial Growth
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Canada Economy",
                description:
                  "Canada is one of the world's most stable and advanced economies, known for its strong financial system, transparent regulations, and business-friendly environment. As a member of the G7, Canada offers a highly developed market with consistent economic growth and global trade integration. The country's economy is diverse, spanning natural resources, manufacturing, technology, and services. Strategically located with direct access to the United States through agreements such as USMCA, Canada serves as a key gateway to North American and international markets.",
                color: "border-l-red-500",
              },
              {
                icon: TrendingUp,
                title: "Canada Market",
                description:
                  "Canada offers a stable and highly developed market with strong purchasing power and a diverse economy. Its transparent regulations, advanced infrastructure, and skilled workforce make it an attractive destination for international trade and investment. Strategically connected to the United States through trade agreements like USMCA, Canada serves as a gateway to North America, providing opportunities across industrial, commercial, and consumer sectors.",
                color: "border-l-blue-500",
              },
              {
                icon: Factory,
                title: "Canadian Bearings Market",
                description:
                  "Canada's bearings market is mature, diverse, and highly industrialized, serving sectors such as automotive, aerospace, energy, manufacturing, and heavy equipment. Strong demand for high-quality, reliable bearings is driven by both industrial growth and maintenance needs. With advanced infrastructure, skilled engineers, and close integration with the U.S. market through agreements like USMCA, Canada offers excellent opportunities for suppliers and distributors of industrial bearings and related products.",
                color: "border-l-emerald-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`bg-white rounded-xl shadow-lg p-8 border-l-4 ${item.color} hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <item.icon className="h-6 w-6 text-secondary" />
                  <h3 className="text-xl font-bold text-secondary">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Brands Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1 text-sm font-medium mb-4">
              Our Brands
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Trusted Brands We Represent
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We partner with globally recognized manufacturers to deliver the highest quality bearings to our customers.
            </p>
          </motion.div>

          <div className="space-y-8">
            {brandDescriptions.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                transition={{ duration: 0.6 }}
                className={`rounded-2xl border ${brand.color} overflow-hidden hover:shadow-xl transition-all duration-300`}
              >
                <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Image */}
                  {brand.image && (
                    <div className="md:w-1/3 relative min-h-[200px] md:min-h-[280px] bg-white">
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className={`${brand.image ? "md:w-2/3" : "w-full"} p-8`}>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-2xl font-bold text-secondary">{brand.name}</h3>
                      {brand.founded && (
                        <span className="text-xs bg-white/80 border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full">
                          Est. {brand.founded}
                        </span>
                      )}
                      <span className="text-xs bg-white/80 border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {brand.country}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-3">{brand.fullName}</p>
                    <p className="text-gray-600 leading-relaxed mb-4">{brand.description}</p>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="text-sm">
                        <span className="font-semibold text-secondary">Products: </span>
                        <span className="text-gray-600">{brand.products}</span>
                      </div>
                      {brand.homepage && (
                        <a
                          href={brand.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          Visit Website
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Partner With Us?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Whether you need standard bearings or hard-to-find obsolete parts, Quaval is your trusted source across North America.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 hover:scale-105 transition-all duration-300"
              >
                <Link href={`/${locale}/products`}>
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white bg-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300"
              >
                <Link href={`/${locale}/contact`}>
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
