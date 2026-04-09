import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSectionSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-16 w-full mb-6" />
          <Skeleton className="h-6 w-3/4 mb-8" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
} 