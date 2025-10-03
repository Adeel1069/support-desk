import HeaderSkeleton from "@/components/skeletons/header-skeleton";
import LayoutSkeleton from "@/components/skeletons/skeleton-layout";
import TableSkeleton from "@/components/skeletons/table-skeleton";

const Loading = () => {
  return (
    <LayoutSkeleton>
      <HeaderSkeleton />
      <TableSkeleton />
    </LayoutSkeleton>
  );
};

export default Loading;
