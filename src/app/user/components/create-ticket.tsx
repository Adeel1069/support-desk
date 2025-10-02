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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTicket, updateTicketById } from "@/actions/ticket-action";
import { toast } from "sonner";
import { useState } from "react";
import { Category, Ticket, TicketPriority } from "@/generated/prisma";
import { priorities } from "@/lib/constants";

const formSchema = z.object({
  subject: z
    .string()
    .nonempty({ message: "Subject is required" })
    .min(3)
    .max(50, {
      message: "Subject must be at most 100 characters.",
    }),
  description: z
    .string()
    .nonempty({ message: "Description is required" })
    .min(3)
    .max(500),
  category: z.string().nonempty({ message: "Category is required" }),
  priority: z.enum(TicketPriority),
});

export function CreateTicket({
  categories,
  editMode = false,
  ticket,
}: {
  editMode: boolean;
  ticket?: Ticket;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: ticket?.subject || "",
      description: ticket?.description || "",
      category: ticket?.categoryId || "",
      priority: ticket?.priority || priorities[0].value,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const promise = editMode
      ? updateTicketById({ ...values, ticketId: ticket?.id || "" })
      : createTicket(values);
    toast.promise(promise, {
      loading: editMode ? "Updating ticket..." : "Creating ticket...",
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
        <Button>{editMode ? "Update Ticket" : "New Ticket"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Update Ticket" : "Create Ticket"}
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to{" "}
            {editMode ? "update a ticket" : "submit a new ticket"} . All fields
            with <span className="text-destructive">*</span> are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subject <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Priority <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities?.map((priorities) => (
                        <SelectItem
                          key={priorities.value}
                          value={priorities.value}
                        >
                          {priorities.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
