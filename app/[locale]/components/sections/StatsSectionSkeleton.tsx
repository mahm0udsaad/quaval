import { Skeleton } from "@/components/ui/skeleton";

export default function StatsSectionSkeleton() {
  return (
    <section className="py-16 bg-white relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-8 rounded-xl bg-white shadow-xl border border-gray-100 h-full flex flex-col items-center justify-center">
              <Skeleton className="h-12 w-20 mb-3" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 