"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Tags, ListCollapse } from "lucide-react"; // ImageUp removed
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const postFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  content: z.string().min(20, "Content must be at least 20 characters long."),
  category: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  // imageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')), // Removed
  // imageFile: z.any().optional(), // Removed
  scheduledAt: z.date().optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostFormProps {
  initialData?: Partial<PostFormValues>; // For editing
  onSubmitForm: (data: PostFormValues) => Promise<void>; // Actual submission logic
  isSubmitting?: boolean;
}

export function PostForm({ initialData, onSubmitForm, isSubmitting }: PostFormProps) {
  const { toast } = useToast();
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      category: "",
      tags: "",
      // imageUrl: "", // Removed
    },
  });

  const handleSubmit = async (data: PostFormValues) => {
    try {
      await onSubmitForm(data);
      toast({ title: "Success", description: "Post saved successfully." });
      // form.reset(); // Optionally reset form
    } catch (error) {
      toast({ title: "Error", description: "Failed to save post.", variant: "destructive" });
    }
  };
  
  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-sans">{initialData?.title ? "Edit Post" : "Create New Post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} className="font-sans" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your blog post here..."
                      className="min-h-[200px] font-serif" // Apply story font here
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="font-sans">
                    You can use Markdown for formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-sans"><ListCollapse className="w-4 h-4" /> Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology" {...field} className="font-sans" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-sans"><Tags className="w-4 h-4" /> Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., nextjs, react, webdev" {...field} className="font-sans" />
                    </FormControl>
                    <FormDescription className="font-sans">Comma-separated values.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ImageUrl Field Removed */}
            {/* ImageFile Field Removed */}

            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2 font-sans"><CalendarIcon className="w-4 h-4" /> Schedule Post (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal font-sans",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="font-sans">
                    Leave blank to publish immediately.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting} className="font-sans">
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting} className="font-sans">
                {isSubmitting ? "Saving..." : (initialData?.title ? "Update Post" : "Create Post")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
