// components/tickets-table-client.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { getTickets, TicketFilters } from "@/actions/ticket-action";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Category,
  TicketPriority,
  TicketStatus,
  User,
} from "@/generated/prisma";
import { CreateTicket } from "./create-ticket";
import InlineTableSkeleton from "@/components/skeletons/inline-table-skeleton";

interface TicketsTableClientProps {
  initialData?: Awaited<ReturnType<typeof getTickets>>;
  categories: Category[];
  users: User[];
  currentUser: User | null;
}

const TicketsTableClient = ({
  initialData,
  categories,
  users,
  currentUser,
}: TicketsTableClientProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData?.data);

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);

  // Fetch tickets with filters
  const fetchTickets = () => {
    startTransition(async () => {
      const filters: TicketFilters = {};

      if (debouncedSearch) {
        filters.search = debouncedSearch;
      }

      if (statusFilter !== "ALL") {
        filters.status = statusFilter as TicketStatus;
      }

      if (priorityFilter !== "ALL") {
        filters.priority = priorityFilter as TicketPriority;
      }

      // if (assigneeFilter !== "ALL") {
      //   if (assigneeFilter === "ASSIGNED_TO_ME") {
      //     // list of the agent users and selected id
      //     // filters.assignedToId = "current-user-id"; // Replace with actual user ID
      //   } else if (assigneeFilter === "UNASSIGNED") {
      //     filters.assignedToId = null;
      //   }
      // }

      const result = await getTickets({
        filters,
        page: currentPage,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      console.log("TCL: fetchTickets -> result", result);
      if (result.success) {
        setData(result.data);
      }
    });
  };

  // Fetch on filter change
  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearch,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    currentPage,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter, priorityFilter, assigneeFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setAssigneeFilter("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    assigneeFilter !== "ALL";

  const onSuccess = () => fetchTickets();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <CreateTicket
          categories={categories || []}
          editMode={false}
          onSuccess={onSuccess}
          users={users}
        />
      </div>
      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>

        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Tickets</SelectItem>
            <SelectItem value="ASSIGNED_TO_ME">Assigned to Me</SelectItem>
            <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results Info */}
      {data?.pagination && (
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * limit + 1} to{" "}
          {Math.min(currentPage * limit, data.pagination.total)} of{" "}
          {data.pagination.total} tickets
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <InlineTableSkeleton />
            ) : data?.tickets && data.tickets.length > 0 ? (
              data.tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    {ticket.subject}
                    {ticket._count &&
                      (ticket._count.comments > 0 ||
                        ticket._count.attachments > 0) && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {ticket._count.comments > 0 &&
                            `${ticket._count.comments} comments`}
                          {ticket._count.comments > 0 &&
                            ticket._count.attachments > 0 &&
                            " · "}
                          {ticket._count.attachments > 0 &&
                            `${ticket._count.attachments} files`}
                        </div>
                      )}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={ticket.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityChip priority={ticket.priority} />
                  </TableCell>
                  <TableCell>
                    {ticket.assignedTo ? (
                      <div className="text-sm">
                        {ticket.assignedTo.name || ticket.assignedTo.email}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        Unassigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {ticket.createdBy ? (
                      <div className="text-sm">
                        {currentUser?.id === ticket.createdBy.id
                          ? "Admin"
                          : ticket.createdBy.name || ticket.createdBy.name}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <CreateTicket
                      categories={categories || []}
                      users={users}
                      editMode={true}
                      onSuccess={onSuccess}
                      ticket={ticket}
                    />
                    <Link
                      href={`/admin/tickets/${ticket.id}`}
                      className="inline-flex items-center justify-center hover:bg-accent hover:text-accent-foreground h-9 w-9 rounded-md transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">
                      {hasActiveFilters
                        ? "No tickets found matching your filters"
                        : "No tickets yet"}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="link" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isPending}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {data.pagination.totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((p) => Math.min(data.pagination.totalPages, p + 1))
            }
            disabled={currentPage === data.pagination.totalPages || isPending}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketsTableClient;
