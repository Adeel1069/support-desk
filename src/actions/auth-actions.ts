"use server";

import { User } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

type ResponseType = {
  success: boolean;
  message: string;
  data?: User | null;
};

/**
 * Sync the authenticated Clerk user with your database.
 * Best practice: move syncing to Clerk webhooks for real-time updates.
 *
 * @returns {Promise<User | null>} The logged-in database user object, or null if no user is authenticated Clerk.
 */
export async function syncUser(): Promise<User | null> {
  // Ensure user is authenticated
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const name = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const image = clerkUser?.imageUrl || "";

  // Upsert user (create if not exists, update if already exists)
  const user = await prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    update: {
      name,
      image,
    },
    create: {
      clerkId: clerkUser.id,
      name,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      image,
    },
  });

  return user;
}

/**
 * Retrieves the currently authenticated user.
 *
 * @returns {Promise<ResponseType>} The logged-in database user object, or null if no user is authenticated through Clerk.
 */

export async function getCurrentUser(): Promise<ResponseType> {
  try {
    // Ensure user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User is not authenticated",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    return {
      success: true,
      message: "User is found",
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error while fetching currently user",
    };
  }
}
