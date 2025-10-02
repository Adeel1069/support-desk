"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth-actions";
import { Role } from "@/generated/prisma";

import { Category } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

// Create category action - only admin can create.
export async function createCategory({ name }: { name: string }): Promise<{
  success: boolean;
  message: string;
  data?: Category | null;
}> {
  try {
    if (!name) throw new Error("Category name is required.");

    const user = await getCurrentUser();

    if (!user.success) throw new Error("Authentication Error");
    if (user.data?.role !== Role.ADMIN) throw new Error("Authorization Error");

    const category = await prisma.category.create({
      data: { name },
    });
    revalidatePath("/admin/categories");
    return {
      success: true,
      message: "Category created successfully",
      data: category,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error occurred while creating category"
    );
  }
}

// Get categories action
export async function getCategories(): Promise<{
  success: boolean;
  message: string;
  data?: Category[] | [];
}> {
  try {
    const categories = await prisma.category.findMany();
    return {
      success: true,
      message: "Success",
      data: categories || [],
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

// Get single category action
export async function getCategoryById(categoryId: string): Promise<{
  success: boolean;
  message: string;
  data?: Category | null;
}> {
  try {
    if (!categoryId) {
      return {
        success: false,
        message: "categoryId is required",
      };
    }
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    return {
      success: true,
      message: "Success",
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error occurred while fetching category",
    };
  }
}

// Update single category action
export async function updateCategoryById({
  categoryId,
  name,
}: {
  name: string;
  categoryId: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: Category | null;
}> {
  try {
    if (!categoryId) throw new Error("Category Id is required");
    if (!name) throw new Error("Category name is required.");

    const user = await getCurrentUser();

    if (!user.success) throw new Error("Authentication Error");
    if (user.data?.role !== Role.ADMIN) throw new Error("Authorization Error");

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: { name },
    });
    revalidatePath("/admin/categories");
    return {
      success: true,
      message: "Category updated successfully",
      data: category,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error occurred while updating category"
    );
  }
}

// Delete single category action
export async function deleteCategoryById(categoryId: string): Promise<{
  success: boolean;
  message: string;
  data?: Category | null;
}> {
  try {
    if (!categoryId) throw new Error("Category Id is required");

    const user = await getCurrentUser();

    if (!user.success) throw new Error("Authentication Error");
    if (user.data?.role !== Role.ADMIN) throw new Error("Authorization Error");
    const category = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    revalidatePath("/admin/categories");
    return {
      success: true,
      message: "Category deleted successfully",
      data: category,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error occurred while deleting category"
    );
  }
}
