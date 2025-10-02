"use server";

import { Prisma, Ticket, TicketPriority } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth-actions";
import { revalidatePath } from "next/cache";

type TicketWithRelations = Prisma.TicketGetPayload<{
  include: {
    createdBy: true;
    assignedTo: true;
    assignedBy: true;
    category: true;
    comments: { include: { user: true } };
    attachments: true;
  };
}>;

// Create Ticket action
export async function createTicket({
  subject,
  description,
  category,
  priority,
}: {
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
}): Promise<{
  success: boolean;
  message: string;
  data?: Ticket | null;
}> {
  try {
    if (!subject || !description || !category || !priority) {
      throw new Error("All fields are required");
    }

    const { success, data: user } = await getCurrentUser();
    if (!success || !user || !user.id) {
      throw new Error("Unauthenticated");
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject: subject,
        description: description,
        createdById: user.id,
        categoryId: category,
        priority,
      },
    });
    revalidatePath(`/${user.role.toLowerCase()}/tickets`);
    return {
      success: true,
      message: "Ticket has been created successfully.",
      data: ticket,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error occurred while creating ticket"
    );
  }
}

// Get all tickets action
export async function getTickets(): Promise<{
  success: boolean;
  message: string;
  data?: Ticket[] | [];
}> {
  try {
    const { success, data: user } = await getCurrentUser();
    if (!success || !user || !user.id) {
      return {
        success: false,
        message: "Authentication Error",
      };
    }
    const tickets = await prisma.ticket.findMany({
      where: {
        createdById: user.id,
      },
    });
    return {
      success: true,
      message: "Success",
      data: tickets,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error occurred while fetching tickets",
    };
  }
}

// Get single ticket action
export async function getTicketById(ticketId?: string): Promise<{
  success: boolean;
  message: string;
  data?: TicketWithRelations | null;
}> {
  try {
    if (!ticketId) {
      throw new Error("Ticket Id is required.");
    }
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        createdBy: true,
        assignedTo: true,
        assignedBy: true,
        category: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: "asc" },
        },
        attachments: true,
      },
    });
    return {
      success: true,
      message: "Success",
      data: ticket,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error occurred while updating ticket"
    );
  }
}

// Update single ticket action
export async function updateTicketById({
  subject,
  description,
  category,
  priority,
  ticketId,
}: {
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  ticketId: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: Ticket | null;
}> {
  try {
    if (!subject || !description || !category || !priority) {
      throw new Error("All fields are required");
    }

    const { success, data: user } = await getCurrentUser();
    if (!success || !user || !user.id) {
      throw new Error("Unauthenticated");
    }
    if (!ticketId) {
      throw new Error("Ticket Id is required.");
    }

    const ticket = await prisma.ticket.update({
      where: {
        id: ticketId.toString(),
      },
      data: {
        subject: subject,
        description: description,
        createdById: user.id,
        categoryId: category,
        priority,
      },
    });
    revalidatePath(`/${user.role.toLowerCase()}/tickets`);
    revalidatePath(`/${user.role.toLowerCase()}/tickets/${ticketId}`);
    return {
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error occurred while updating ticket"
    );
  }
}

// Delete single ticket action
export async function deleteCategoryById({
  ticketId,
}: {
  ticketId: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: Ticket | null;
}> {
  try {
    if (!ticketId) {
      return {
        success: false,
        message: "ticketId is required",
      };
    }
    const ticket = await prisma.ticket.delete({
      where: {
        id: ticketId,
      },
    });
    return {
      success: true,
      message: "Ticket has been deleted.",
      data: ticket,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error occurred while deleting ticket",
    };
  }
}
