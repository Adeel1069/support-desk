"use server";

import { Prisma, Role, User } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth-actions";
import { revalidatePath } from "next/cache";

export interface UserFilters {
  role?: Role;
  search?: string;
}

interface UserQueryParams {
  filters?: UserFilters;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

// Get users action
export async function getUsers(params: UserQueryParams = {}): Promise<{
  success: boolean;
  message: string;
  data?: User[] | [];
}> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser.success) {
      return {
        success: true,
        message: "Authentication Error",
      };
    }
    if (currentUser.data?.role !== Role.ADMIN) {
      return {
        success: true,
        message: "Authorization Error",
      };
    }

    const { filters = {}, sortBy = "createdAt", sortOrder = "desc" } = params;

    // Dynamic where clause
    const whereClause = buildWhereClause(currentUser.data, filters);

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
    return {
      success: true,
      message: "Success",
      data: users || [],
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error occurred while fetching categories",
    };
  }
}

// Update single user
export async function updateUserById({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}): Promise<{
  success: boolean;
  message: string;
  data?: User | null;
}> {
  try {
    if (!userId) throw new Error("User Id is required");
    if (!role) throw new Error("User Role is required.");

    const currentUser = await getCurrentUser();

    if (!currentUser.success) throw new Error("Authentication Error");
    if (currentUser.data?.role !== Role.ADMIN)
      throw new Error("Authorization Error");

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { role },
    });
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User updated successfully",
      data: user,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error occurred while updating user"
    );
  }
}

// Helper function to build dynamic where clause
function buildWhereClause(
  user: { id: string; role: string },
  filters: UserFilters
): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {
    AND: [],
  };

  // Admins can see all tickets (no additional restrictions)
  const conditions: Prisma.UserWhereInput[] = [
    // Exclude current user
    {
      id: {
        not: user.id,
      },
    },
  ];

  // Assigned to filter
  if (filters.role) {
    conditions.push({
      role: filters.role,
    });
  }

  // Search filter (searches in subject and description)
  if (filters.search && filters.search.trim() !== "") {
    conditions.push({
      OR: [
        {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          email: {
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
