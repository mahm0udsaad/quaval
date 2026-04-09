import { Skeleton } from "@/components/ui/skeleton";

export default function AboutSectionSkeleton() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <Skeleton className="h-6 w-24 mb-6" />
            <Skeleton className="h-12 w-full mb-6" />
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-28" />
            </div>
          </div>
          
          <div className="relative">
            <Skeleton className="w-full aspect-video lg:aspect-square rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
} 