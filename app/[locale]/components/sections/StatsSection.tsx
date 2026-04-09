import { getStatsSectionData } from "@/lib/api";
import StatsSectionClient from "./StatsSectionClient";

interface StatsSectionProps {
  locale: string;
}

export default async function StatsSection({ locale }: StatsSectionProps) {
  const statsData = await getStatsSectionData(locale);
  console.log(statsData?.section.content_blocks);
  if (!statsData) {
    return null;
  }

  return <StatsSectionClient {...statsData} />;
}