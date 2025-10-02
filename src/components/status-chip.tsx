import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/generated/prisma";

// TODO - Update the styles
const statusConfig: Record<
  TicketStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  OPEN: { label: "Open", variant: "secondary" },
  IN_PROGRESS: { label: "In Progress", variant: "default" },
  RESOLVED: { label: "Resolved", variant: "outline" },
  CLOSED: { label: "Closed", variant: "destructive" },
  ARCHIVED: { label: "Archived", variant: "secondary" },
};

const StatusChip = ({ status }: { status: TicketStatus }) => {
  const { label, variant } = statusConfig[status];

  return <Badge variant={variant}>{label}</Badge>;
};

export default StatusChip;
