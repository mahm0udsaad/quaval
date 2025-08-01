import { getTrustedPartnersSectionData } from "@/lib/api";
import TrustedPartnersSectionClient from "./TrustedPartnersSectionClient";

interface TrustedPartnersSectionProps {
  locale: string;
}

export default async function TrustedPartnersSection({ locale }: TrustedPartnersSectionProps) {
  const partnersData = await getTrustedPartnersSectionData(locale);
  console.log(partnersData?.section.content_blocks);
  
  if (!partnersData) {
    return null;
  }

  // Extract content blocks
  const contentBlocks = partnersData.section.content_blocks;
  
  // Find heading and title blocks
  const heading = contentBlocks.find(block => block.block_key === 'heading');
  const title = contentBlocks.find(block => block.block_key === 'title');
  
  // Find all partner logo blocks (they start with 'partner_logo_')
  const partners = contentBlocks.filter(block => 
    block.block_key.startsWith('partner_logo_') && 
    block.block_type === 'image' &&
    block.is_enabled
  );

  return (
    <TrustedPartnersSectionClient 
      section={partnersData.section}
      contentBlocks={{
        heading,
        title
      }}
      partners={partners}
    />
  );
}