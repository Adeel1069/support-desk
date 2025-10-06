import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

interface InlineTableSkeletonProps {
  rows?: number;
  columns?: number;
  columnWidths?: string[];
}

const InlineTableSkeleton = ({
  rows = 5,
  columns = 7,
  columnWidths = [],
}: InlineTableSkeletonProps) => {
  const defaultWidths = Array.from({ length: columns }, (_, i) => {
    if (i === 0) return "w-[200px]";
    if (i === columns - 1) return "w-[40px] ml-auto";
    return "w-[100px]";
  });

  console.info(Array.from({ length: 5 }));

  const widths = columnWidths.length === columns ? columnWidths : defaultWidths;

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className={`h-6 ${widths[colIndex]}`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default InlineTableSkeleton;
