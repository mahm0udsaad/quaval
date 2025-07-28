import { Skeleton } from "@/components/ui/skeleton";

export default function CTASectionSkeleton() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <Skeleton className="h-6 w-24 mx-auto mb-6 bg-white/20" />
        <Skeleton className="h-16 w-96 mx-auto mb-6 bg-white/20" />
        <Skeleton className="h-8 w-2/3 mx-auto mb-10 bg-white/20" />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <Skeleton className="h-6 w-6 mb-4 bg-white/30" />
              <Skeleton className="h-6 w-24 mb-2 bg-white/30" />
              <Skeleton className="h-4 w-full bg-white/30" />
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Skeleton className="h-12 w-32 bg-white/20" />
          <Skeleton className="h-12 w-32 bg-white/20" />
        </div>
      </div>
    </section>
  );
} 