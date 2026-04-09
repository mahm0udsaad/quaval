import { Skeleton } from "@/components/ui/skeleton";

export default function TrustedPartnersSectionSkeleton() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-6 w-24 mx-auto mb-4" />
          <Skeleton className="h-8 w-64 mx-auto" />
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-32" />
          ))}
        </div>
      </div>
    </section>
  );
} 