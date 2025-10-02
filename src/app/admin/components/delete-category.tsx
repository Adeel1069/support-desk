"use client";

import { deleteCategoryById } from "@/actions/category-actions";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Category } from "@/generated/prisma";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DeleteCategoryButton = ({ category }: { category: Category }) => {
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const deleteCategory = async () => {
    setDeleting(true);
    const promise = deleteCategoryById(category.id);
    toast.promise(promise, {
      loading: "Deleting category...",
      success: (data) => {
        setOpen(false);
        setDeleting(false);
        return data.message;
      },
      error: (error) => {
        setDeleting(false);
        return error || "Unknown error";
      },
    });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!deleting) setOpen(isOpen); // To prevent closing modal while form is being submitting
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Delete category">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{category.name}</strong>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <Button
            disabled={deleting}
            variant="destructive"
            onClick={deleteCategory}
          >
            Delete
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryButton;
