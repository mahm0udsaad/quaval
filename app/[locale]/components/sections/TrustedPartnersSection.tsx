import { getTrustedPartnersSectionData } from "@/lib/api";
import TrustedPartnersSectionClient from "./TrustedPartnersSectionClient";

interface TrustedPartnersSectionProps {
  locale: string;
}

export default async function TrustedPartnersSection({ locale }: TrustedPartnersSectionProps) {
  const partnersData = await getTrustedPartnersSectionData(locale);
  
  if (!partnersData) {
    return null;
  }

  return <TrustedPartnersSectionClient {...partnersData} />;
} 