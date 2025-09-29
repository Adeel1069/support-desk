"use server";

import { Ticket } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth-actions";

// Create Ticket action
export async function createTicket(formData: FormData): Promise<{
  success: boolean;
  message: string;
  data?: Ticket | null;
}> {
  try {
    const subject = formData.get("subject");
    const description = formData.get("description");

    if (!subject || !description) {
      return {
        success: false,
        message: "Both fields (subject and description) are required",
      };
    }

    const { success, data: user } = await getCurrentUser();
    if (!success || !user || !user.id) {
      return {
        success: false,
        message: "Unauthenticated",
      };
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject: subject.toString(),
        description: description?.toString(),
        createdById: user.id,
      },
    });
    return {
      success: true,
      message: "Ticket has been created successfully.",
      data: ticket,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error occurred while creating ticket",
    };
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
export async function getTicketById({
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
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });
    return {
      success: true,
      message: "Success",
      data: ticket,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error occurred while fetching ticket",
    };
  }
}

// Update single ticket action
export async function updateTicketById(formData: FormData): Promise<{
  success: boolean;
  message: string;
  data?: Ticket | null;
}> {
  try {
    const subject = formData.get("subject");
    const description = formData.get("description");
    const ticketId = formData.get("ticketId");
    if (!ticketId) {
      return {
        success: false,
        message: "ticketId is required",
      };
    }
    const ticket = await prisma.ticket.update({
      where: {
        id: ticketId.toString(),
      },
      data: {
        subject: subject?.toString(),
        description: description?.toString(),
      },
    });
    return {
      success: true,
      message: "Ticket has been updated",
      data: ticket,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error occurred while updating ticket",
    };
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
