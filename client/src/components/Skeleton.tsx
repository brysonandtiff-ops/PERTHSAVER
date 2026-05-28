import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      aria-busy="true"
      aria-label="Loading..."
      {...props}
    />
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass border-white/8 rounded-2xl p-6", className)} aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 bg-white/10 mb-3" />
          <Skeleton className="h-8 w-32 bg-white/15" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="glass border-white/8 rounded-2xl p-6" aria-busy="true" aria-label="Loading product...">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-lg bg-white/10 shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4 bg-white/15" />
          <Skeleton className="h-4 w-1/2 bg-white/10" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-6 w-20 bg-white/15" />
            <Skeleton className="h-8 w-24 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton({ 
  height = "300px",
  showHeader = true,
  className 
}: { 
  height?: string;
  showHeader?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("glass border-white/8 rounded-2xl", className)} aria-busy="true" aria-label="Loading chart...">
      {showHeader && (
        <div className="p-6 border-b border-white/8">
          <Skeleton className="h-6 w-48 bg-white/15 mb-2" />
          <Skeleton className="h-4 w-64 bg-white/10" />
        </div>
      )}
      <div className="p-6">
        <div className="relative rounded-lg overflow-hidden bg-white/5" style={{ height }}>
          <Skeleton className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/10" />
          <div className="absolute inset-0 flex items-end justify-around p-8 gap-2">
            {[65, 80, 55, 90, 70, 85].map((h, i) => (
              <Skeleton 
                key={`bar-${h}-${i}`}
                className="bg-white/10 rounded-t-lg" 
                style={{ height: `${h}%`, width: '100%' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading list...">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`item-${i}`} className="glass border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6 rounded-full bg-white/10 shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-48 bg-white/15" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32 bg-white/10" />
                <Skeleton className="h-4 w-24 bg-white/10" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 bg-white/15 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PostSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading posts...">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`post-${i}`} className="glass border-white/8 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-full bg-gradient-to-br from-white/15 to-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32 bg-white/15" />
              <Skeleton className="h-3 w-24 bg-white/10" />
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-5/6 bg-white/10" />
          </div>
          
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
            <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
          </div>
          
          <div className="flex items-center gap-6 pt-4 border-t border-white/10">
            <Skeleton className="h-4 w-16 bg-white/10" />
            <Skeleton className="h-4 w-16 bg-white/10" />
            <Skeleton className="h-4 w-16 bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GoalCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6" aria-busy="true" aria-label="Loading goals...">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`goal-${i}`} className="glass border-white/8 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32 bg-white/15" />
              <Skeleton className="h-8 w-24 bg-white/15" />
            </div>
            <Skeleton className="h-8 w-8 rounded-lg bg-white/10" />
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 bg-white/10" />
              <Skeleton className="h-4 w-16 bg-white/10" />
            </div>
            <Skeleton className="h-2 w-full rounded-full bg-white/10" />
          </div>
          
          <div className="flex gap-2 pt-4 border-t border-white/8">
            <Skeleton className="h-8 flex-1 rounded-lg bg-white/10" />
            <Skeleton className="h-8 flex-1 rounded-lg bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeletons() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex flex-col gap-4 mb-12">
        <div>
          <Skeleton className="h-10 w-64 bg-white/15 mb-2" />
          <Skeleton className="h-5 w-48 bg-white/10" />
        </div>
        <Skeleton className="h-12 w-40 rounded-lg bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ChartSkeleton height="300px" />
        <ChartSkeleton height="300px" />
      </div>
    </div>
  );
}

export function GrocerySkeletons() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Skeleton className="h-10 w-96 bg-white/15 mb-2" />
        <Skeleton className="h-5 w-64 bg-white/10" />
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-lg bg-white/10" />
          <Skeleton className="h-12 w-40 rounded-lg bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={`product-${i}`} />
        ))}
      </div>
    </div>
  );
}

export function AnalyticsSkeletons() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <Skeleton className="h-10 w-64 bg-white/15 mb-2" />
            <Skeleton className="h-5 w-96 bg-white/10" />
          </div>
          <Skeleton className="h-12 w-40 rounded-lg bg-white/10" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 bg-white/10" />
          <Skeleton className="h-5 w-24 bg-white/10" />
          <Skeleton className="h-10 w-40 rounded-lg bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={`card-${i}`} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        <ChartSkeleton height="320px" />
        <ChartSkeleton height="320px" />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ChartSkeleton height="400px" />
        <ChartSkeleton height="400px" />
      </div>
    </div>
  );
}

export function BillTrackerSkeletons() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <Skeleton className="h-10 w-48 bg-white/15 mb-2" />
          <Skeleton className="h-5 w-64 bg-white/10" />
        </div>
        <Skeleton className="h-12 w-32 rounded-lg bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={`bill-${i}`} />
        ))}
      </div>

      <ListSkeleton count={4} />
    </div>
  );
}
