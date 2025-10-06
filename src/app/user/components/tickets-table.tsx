import { getTickets } from "@/actions/ticket-action";
import PriorityChip from "@/components/priority-chip";
import StatusChip from "@/components/status-chip";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
const AllTickets = async () => {
  const { data } = await getTickets();
  console.info(data);
  return (
    <div className="space-y-4">
      <Input placeholder="Search My Tickets..." className="max-w-sm" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.tickets && data.tickets.length > 0 ? (
            data.tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                  <StatusChip status={ticket.status} />
                </TableCell>
                <TableCell>
                  <PriorityChip priority={ticket.priority} />
                </TableCell>
                <TableCell>{ticket.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>{ticket.updatedAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Link href={`/user/tickets/${ticket.id}`}>
                    <ArrowRight />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-28">
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllTickets;
