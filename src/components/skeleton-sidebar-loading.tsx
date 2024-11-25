"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonSidebarLoading() {
  return (
    <div className="flex flex-col space-y-2">
      <Skeleton className="h-4 w-[90%]" />
      {[1, 2, 3, 4, 5, 6].map((_) => (
        <Skeleton key={_} className="h-4 w-full" />
      ))}
    </div>
  );
}
