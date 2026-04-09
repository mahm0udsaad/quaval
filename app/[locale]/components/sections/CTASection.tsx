import { getCTASectionData } from "@/lib/api";
import CTASectionClient from "./CTASectionClient";

interface CTASectionProps {
  locale: string;
}

export default async function CTASection({ locale }: CTASectionProps) {
  const ctaData = await getCTASectionData(locale);
  
  if (!ctaData) {
    return null;
  }

  return <CTASectionClient {...ctaData} />;
} 