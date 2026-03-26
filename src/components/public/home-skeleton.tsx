import { Skeleton } from "@/components/ui/skeleton"

export function HomePageSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[92vh] flex items-center bg-[#050f1e] pt-20">
        <div className="container mx-auto px-6 md:px-12 relative z-20">
          <div className="max-w-5xl space-y-6">
            <Skeleton className="h-6 w-32 rounded-full bg-white/10" />
            <Skeleton className="h-20 w-3/4 md:h-32 lg:h-40 bg-white/10" />
            <Skeleton className="h-6 w-2/3 bg-white/10" />
            <Skeleton className="h-14 w-40 rounded-full bg-white/10" />
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <Skeleton className="h-16 w-24" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section Skeleton */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-64" />
            </div>
            <Skeleton className="h-8 w-40" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-y-24">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] rounded-[2.5rem]" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
