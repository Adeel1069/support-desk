import { Skeleton } from "../ui/skeleton";

const HeaderSkeleton = () => {
  return (
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
};

export default HeaderSkeleton;
