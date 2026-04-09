import { Suspense } from "react";
import FeaturedProducts from "./components/FeaturedProducts";

// Import section components and skeletons
import {
  HeroSection,
  StatsSection,
  AboutSection,
  FeaturesSection,
  TrustedPartnersSection,
  CTASection,
  HeroSectionSkeleton,
  StatsSectionSkeleton,
  AboutSectionSkeleton,
  FeaturesSectionSkeleton,
  TrustedPartnersSectionSkeleton,
  CTASectionSkeleton
} from "./components/sections";

interface HomeProps {
  params: {
    locale: string;
  };
}

export default async function Home({ params: { locale } }: HomeProps) {
  return (
    <div className="bg-background overflow-hidden">
      {/* Hero Section */}
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection locale={locale} />
      </Suspense>

      {/* Stats Section */}
      <Suspense fallback={<StatsSectionSkeleton />}>
        <StatsSection locale={locale} />
      </Suspense>

      {/* About Section */}
      <Suspense fallback={<AboutSectionSkeleton />}>
        <AboutSection locale={locale} />
      </Suspense>

      {/* Features Section */}
      <Suspense fallback={<FeaturesSectionSkeleton />}>
        <FeaturesSection locale={locale} />
      </Suspense>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Trusted By Section */}
      <Suspense fallback={<TrustedPartnersSectionSkeleton />}>
        <TrustedPartnersSection locale={locale} />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<CTASectionSkeleton />}>
        <CTASection locale={locale} />
      </Suspense>
    </div>
  );
}