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
import { createTicket } from "@/actions/ticket-action";
import { toast } from "sonner";
import { useState } from "react";
import { Category } from "@/generated/prisma";

const priorities = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

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
  category: z.string(),
  priority: z.string().nonempty({ message: "Priority is required" }),
});

export function CreateTicket({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      description: "",
      category: "",
      priority: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const promise = createTicket(values);
    toast.promise(promise, {
      loading: "Creating ticket...",
      success: (data) => {
        setLoading(false);
        setOpen(false);
        form.reset();
        return data?.message;
      },
      error: (data) => {
        setLoading(false);
        return data?.message;
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!loading) setOpen(isOpen);
        if (!isOpen) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>New Ticket</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>Create Ticket</DialogTitle>
          <DialogDescription>
            Fill out the form below to submit a new ticket. All fields with{" "}
            <span className="text-destructive">*</span> are required.
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
                  <FormLabel>Category</FormLabel>
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
                        <SelectItem key={category.id} value={category.name}>
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
                  <FormLabel>Priority</FormLabel>
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
