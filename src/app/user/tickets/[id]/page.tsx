import StatusChip from "@/components/status-chip";
import PriorityChip from "@/components/priority-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateTicket } from "../../components/create-ticket";
import { getCategories } from "@/actions/category-actions";
import { getTicketById } from "@/actions/ticket-action";

const TicketDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { data: categories } = await getCategories();
  const { id } = await params;
  const { data: ticket } = await getTicketById(id);

  if (!ticket) {
    return <div className="p-6 text-center">Ticket not found</div>;
  }

  return (
    <main className="p-10 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/user/tickets">
            <ArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold">Ticket Details</h1>
        </div>
        <CreateTicket
          categories={categories || []}
          editMode={true}
          ticket={ticket}
        />
      </div>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{ticket.subject}</CardTitle>
          <p className="text-muted-foreground">{ticket.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <StatusChip status={ticket.status} />
            <PriorityChip priority={ticket.priority} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
              <span className="font-semibold">Category: </span>
              {ticket.category?.name || "Uncategorized"}
            </p>
            <p>
              <span className="font-semibold">Created By: </span>
              {ticket.createdBy?.name || ticket.createdBy?.email}
            </p>
            <p>
              <span className="font-semibold">Assigned To: </span>
              {ticket.assignedTo?.name || "Unassigned"}
            </p>
            <p>
              <span className="font-semibold">Assigned By: </span>
              {ticket.assignedBy?.name || "—"}
            </p>
            <p>
              <span className="font-semibold">Created At: </span>
              {ticket.createdAt.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Last Updated: </span>
              {ticket.updatedAt.toLocaleString()}
            </p>
          </div>

          {/* Attachments */}
          {ticket.attachments.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Attachments</h3>
              <ul className="list-disc list-inside space-y-1">
                {ticket.attachments.map((file) => (
                  <li key={file.id}>
                    <Link
                      href={file.url}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {file.fileName || "Download"}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ticket.comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet</p>
          ) : (
            ticket.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar>
                  <AvatarImage src={comment.user.image || ""} />
                  <AvatarFallback>
                    {comment.user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {comment.user.name || "User"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {comment.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <Separator className="my-2" />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default TicketDetailsPage;
