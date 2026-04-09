import { getFeaturesSectionData } from "@/lib/api";
import FeaturesSectionClient from "./FeaturesSectionClient";

interface FeaturesSectionProps {
  locale: string;
}

export default async function FeaturesSection({ locale }: FeaturesSectionProps) {
  const featuresData = await getFeaturesSectionData(locale);
  
  if (!featuresData) {
    return null;
  }

  return <FeaturesSectionClient {...featuresData} locale={locale} />;
} 