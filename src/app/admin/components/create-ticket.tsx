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
import { Category, Ticket, TicketPriority, User } from "@/generated/prisma";
import { priorities } from "@/lib/constants";
import Spinner from "@/components/spinner";
import { Pencil } from "lucide-react";

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
  assignedToId: z.string(),
  priority: z.enum(TicketPriority),
});

type CreateTicketProps =
  | {
      editMode: true;
      ticket: Ticket;
      categories: Category[];
      users: User[];
      onSuccess?: () => void;
    }
  | {
      editMode?: false;
      ticket?: undefined;
      categories: Category[];
      users: User[];
      onSuccess?: () => void;
    };

export function CreateTicket({
  categories,
  users,
  editMode = false,
  ticket,
  onSuccess,
}: CreateTicketProps) {
  const defaultValues = {
    subject: ticket?.subject || "",
    description: ticket?.description || "",
    category: ticket?.categoryId || "",
    assignedToId: ticket?.assignedToId || "",
    priority: ticket?.priority || priorities[0].value,
  };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
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
        form.reset(defaultValues);
        if (onSuccess) onSuccess();
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
          <Button>New Ticket</Button>
        )}
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
            <FormField
              control={form.control}
              name="assignedToId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
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
                Submit {loading && <Spinner />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
