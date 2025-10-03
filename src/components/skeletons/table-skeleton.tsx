import { Skeleton } from "../ui/skeleton";

const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Skeleton className="h-8 max-w-sm" />
      {/* Table Header */}
      <div className="border rounded-lg p-4">
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      {/* Table Body */}
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-60" />
              </div>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
