"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth-actions";
import { Role } from "@/generated/prisma";

import { Category } from "@/generated/prisma";

// Create category action - only admin can create.
export async function createCategory(payload: Category): Promise<{
  success: boolean;
  message: string;
  data?: Category | null;
}> {
  try {
    const { name } = payload;
    if (!name) {
      return {
        success: false,
        message: "Name field is required",
      };
    }
    const user = await getCurrentUser();
    if (!user.success) {
      return {
        success: false,
        message: "Authentication Error",
      };
    }
    if (user.data?.role !== Role.ADMIN) {
      return {
        success: false,
        message: "Authorization Error",
      };
    }
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    return {
      success: true,
      message: "Category created successfully",
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error occurred while create category",
    };
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
    if (!categoryId) {
      return {
        success: false,
        message: "categoryId is required",
      };
    }
    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
      },
    });
    return {
      success: true,
      message: "Category has been updated",
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error occurred while updating category",
    };
  }
}

// Delete single category action
export async function deleteCategoryById({
  categoryId,
}: {
  categoryId: string;
}): Promise<{
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
    const category = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    return {
      success: true,
      message: "Category has been deleted.",
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error occurred while deleting category",
    };
  }
}
