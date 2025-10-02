import { Badge } from "@/components/ui/badge";
import { TicketPriority } from "@/generated/prisma";

// TODO - Update the styles
const priorityConfig: Record<
  TicketPriority,
  { label: string; className: string }
> = {
  LOW: { label: "Low", className: "bg-gray-200 text-gray-700" },
  MEDIUM: { label: "Medium", className: "bg-blue-200 text-blue-800" },
  HIGH: { label: "High", className: "bg-orange-200 text-orange-800" },
  CRITICAL: { label: "Critical", className: "bg-red-200 text-red-800" },
};

const PriorityChip = ({ priority }: { priority: TicketPriority }) => {
  const { label, className } = priorityConfig[priority];
  return <Badge className={className}>{label}</Badge>;
};

export default PriorityChip;
