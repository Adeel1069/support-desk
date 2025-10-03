import HeaderSkeleton from "@/components/skeletons/header-skeleton";
import LayoutSkeleton from "@/components/skeletons/skeleton-layout";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <LayoutSkeleton>
      <HeaderSkeleton />
      <div className="p-10 space-y-4 border rounded-lg">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-7 w-50" />
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10" />
            <Skeleton className="w-10 h-10" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-8 w-80" />
          </div>
        </div>
      </div>
    </LayoutSkeleton>
  );
};

export default Loading;
