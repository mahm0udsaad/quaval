import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturesSectionSkeleton() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Skeleton className="h-6 w-24 mx-auto mb-4" />
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <Skeleton className="w-16 h-16 rounded-xl mb-6" />
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <div className="pt-4 border-t border-gray-100">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 