"use server";

import { Role, User } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth-actions";
import { revalidatePath } from "next/cache";

// Get users action
export async function getUsers(): Promise<{
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

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUser.data.id,
        },
      },
      orderBy: {
        createdAt: "desc",
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
