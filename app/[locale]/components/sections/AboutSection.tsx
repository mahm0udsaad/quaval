import { getAboutSectionData } from "@/lib/api";
import AboutSectionClient from "./AboutSectionClient";

interface AboutSectionProps {
  locale: string;
}

export default async function AboutSection({ locale }: AboutSectionProps) {
  const aboutData = await getAboutSectionData(locale);
  
  if (!aboutData) {
    return null;
  }

  return <AboutSectionClient {...aboutData} locale={locale} />;
} 