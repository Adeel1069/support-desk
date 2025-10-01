import { getTickets } from "@/actions/ticket-action";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
const AllTickets = async () => {
  const { data } = await getTickets();
  return (
    <div className="space-y-4">
      <Input placeholder="Search My Tickets..." className="max-w-sm" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.length &&
            data.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell className="text-red-500 font-semibold">
                  High
                </TableCell>
                <TableCell>{ticket.updatedAt.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllTickets;
