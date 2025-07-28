import { getHeroSectionData } from "@/lib/api";
import HeroSectionClient from "./HeroSectionClient";

interface HeroSectionProps {
  locale: string;
}

export default async function HeroSection({ locale }: HeroSectionProps) {
  const heroData = await getHeroSectionData(locale);
  
  if (!heroData) {
    return null;
  }

  return <HeroSectionClient sectionData={heroData} />;
} 