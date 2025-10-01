import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import Link from "next/link";
const RecentTickets = () => {
  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Tickets</h2>
          <Button variant="link">
            <Link href="/user/tickets">View All Tickets →</Link>
          </Button>
        </div>
      </div>
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
          <TableRow>
            <TableCell>Login issue</TableCell>
            <TableCell>Open</TableCell>
            <TableCell className="text-red-500 font-semibold">High</TableCell>
            <TableCell>2 days ago</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Billing error</TableCell>
            <TableCell>In Progress</TableCell>
            <TableCell className="text-yellow-500 font-semibold">
              Medium
            </TableCell>
            <TableCell>5 hrs ago</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Feature request</TableCell>
            <TableCell>Closed</TableCell>
            <TableCell className="text-green-500 font-semibold">Low</TableCell>
            <TableCell>1 week ago</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default RecentTickets;
