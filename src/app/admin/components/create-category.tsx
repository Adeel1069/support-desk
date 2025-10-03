"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Category } from "@/generated/prisma";
import { createCategory, updateCategoryById } from "@/actions/category-actions";
import { Pencil } from "lucide-react";
import Spinner from "@/components/spinner";

const formSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Category name is required" })
    .min(3)
    .max(50),
});

export function CreateCategory({
  editMode = false,
  category,
}: {
  editMode: boolean;
  category?: Category;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const promise = editMode
      ? updateCategoryById({ ...values, categoryId: category?.id || "" })
      : createCategory(values);
    toast.promise(promise, {
      loading: editMode ? "Updating category..." : "Creating category...",
      success: (data) => {
        setLoading(false);
        setOpen(false);
        form.reset();
        return data?.message;
      },
      error: (err) => {
        setLoading(false);
        return err.message || "Unknown error";
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!loading) setOpen(isOpen); // To prevent closing modal while form is being submitting
        if (!isOpen) form.reset();
      }}
    >
      <DialogTrigger asChild>
        {editMode ? (
          <Button variant="ghost" size="sm">
            <Pencil />
          </Button>
        ) : (
          <Button>New Category</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Update Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to{" "}
            {editMode ? "update a category" : "submit a new category"} . All
            fields with <span className="text-destructive">*</span> are
            required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                Submit {loading && <Spinner />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
