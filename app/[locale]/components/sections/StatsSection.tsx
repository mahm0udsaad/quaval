import { getStatsSectionData } from "@/lib/api";
import StatsSectionClient from "./StatsSectionClient";

interface StatsSectionProps {
  locale: string;
}

export default async function StatsSection({ locale }: StatsSectionProps) {
  const statsData = await getStatsSectionData(locale);
  
  if (!statsData) {
    return null;
  }

  return <StatsSectionClient {...statsData} />;
}