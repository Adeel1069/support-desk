"use server";

import {
  Prisma,
  Role,
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth-actions";
import { revalidatePath } from "next/cache";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/lib/constants";

export interface TicketFilters {
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority | TicketPriority[];
  assignedToId?: string;
  categoryId?: string;
  search?: string;
  createdById?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface TicketQueryParams {
  filters?: TicketFilters;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "status";
  sortOrder?: "asc" | "desc";
}

type TicketsWithRelations = Prisma.TicketGetPayload<{
  include: {
    createdBy: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    assignedTo: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
      };
    };
    _count: {
      select: {
        comments: true;
        attachments: true;
      };
    };
  };
}>;

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
  assignedToId,
}: {
  subject: string;
  description: string;
  category: string;
  assignedToId?: string;
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
        assignedToId: user.role === Role.ADMIN ? assignedToId : null,
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
export async function getTickets(params: TicketQueryParams = {}): Promise<{
  success: boolean;
  message: string;
  data?: {
    tickets: TicketsWithRelations[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}> {
  try {
    const { success, data: user } = await getCurrentUser();
    if (!success || !user || !user.id) {
      return {
        success: false,
        message: "Authentication Error",
      };
    }

    const {
      filters = {},
      page = DEFAULT_PAGE,
      limit = DEFAULT_PAGE_LIMIT,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    // Dynamic where clause
    const whereClause = buildWhereClause(user, filters);

    const skip = (page - 1) * limit;

    // Query Execution
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where: whereClause,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              comments: true,
              attachments: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.ticket.count({
        where: whereClause,
      }),
    ]);

    return {
      success: true,
      message: "Success",
      data: {
        tickets,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
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
  assignedToId,
}: {
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  ticketId: string;
  assignedToId?: string;
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
        categoryId: category,
        priority,
        assignedToId:
          user.role === Role.ADMIN && assignedToId ? assignedToId : null,
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

// Helper function to build dynamic where clause
function buildWhereClause(
  user: { id: string; role: string },
  filters: TicketFilters
): Prisma.TicketWhereInput {
  const where: Prisma.TicketWhereInput = {
    AND: [],
  };

  // Role-based access control
  if (user.role === Role.USER) {
    // Regular users can only see their own tickets
    where.OR = [{ createdById: user.id }];
  }
  if (user.role === Role.AGENT) {
    // Regular users can only see their own tickets
    where.OR = [{ assignedToId: user.id }];
  }

  // Admins can see all tickets (no additional restrictions)
  const conditions: Prisma.TicketWhereInput[] = [];

  // Status filter
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      conditions.push({
        status: { in: filters.status },
      });
    } else {
      conditions.push({
        status: filters.status,
      });
    }
  }

  // Priority filter
  if (filters.priority) {
    if (Array.isArray(filters.priority)) {
      conditions.push({
        priority: { in: filters.priority },
      });
    } else {
      conditions.push({
        priority: filters.priority,
      });
    }
  }

  // Assigned to filter
  if (filters.assignedToId) {
    conditions.push({
      assignedToId: filters.assignedToId,
    });
  }

  // Category filter
  if (filters.categoryId) {
    conditions.push({
      categoryId: filters.categoryId,
    });
  }

  // Created by filter (admin only typically)
  if (filters.createdById && user.role === Role.ADMIN) {
    conditions.push({
      createdById: filters.createdById,
    });
  }

  // Date range filter
  if (filters.dateFrom || filters.dateTo) {
    const dateFilter: Prisma.DateTimeFilter = {};
    if (filters.dateFrom) {
      dateFilter.gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      dateFilter.lte = filters.dateTo;
    }
    conditions.push({
      createdAt: dateFilter,
    });
  }

  // Search filter (searches in subject and description)
  if (filters.search && filters.search.trim() !== "") {
    conditions.push({
      OR: [
        {
          subject: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Add all conditions to AND clause
  if (conditions.length > 0) {
    where.AND = conditions;
  }

  return where;
}
